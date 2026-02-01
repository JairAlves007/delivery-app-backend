import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { createProductBodySchema } from "@/schemas/product-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

type CreateProductServiceRequest = z.infer<typeof createProductBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle({
		establishmentId,
		categoryId,
		bannerIds,
		tagIds,
		paramsToForget,
		...data
	}: CreateProductServiceRequest): Promise<void> {
		const banners = !!bannerIds
			? {
					connect: bannerIds.map(bannerId => ({ id: bannerId }))
				}
			: undefined;

		await this.productRepository.create({
			...data,
			slug: slugify(data.name),
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			category: {
				connect: {
					id: categoryId
				}
			},
			banners,
			tags: {
				create: tagIds.map(tagId => ({
					tag: { connect: { id: tagId } }
				}))
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
