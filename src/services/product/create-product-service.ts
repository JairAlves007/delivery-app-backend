import Constants from "@/helpers/constants.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { domainEvents } from "@/lib/domain-event.ts";
import { createProductBodySchema } from "@/schemas/product-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

type CreateProductServiceRequest = z.infer<typeof createProductBodySchema> &
	Omit<ForgetAllListingCacheKeysParams, "baseCacheKey">;

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

		domainEvents.emit(Constants.EVENTS_KEYS.forgetAllListingCacheKeys, {
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
