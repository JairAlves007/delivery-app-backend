import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { updateProductBodySchema } from "@/schemas/product-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateProductRequest
	extends
		z.infer<typeof updateProductBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle({
		id,
		establishmentId,
		categoryId,
		name,
		bannerIds,
		tagIds,
		paramsToForget,
		...data
	}: UpdateProductRequest) {
		await this.productRepository.deleteOldTags(id);

		await this.productRepository.update({
			id,
			data: {
				...data,
				name,
				...(!!name && { slug: slugify(name) }),
				establishment: {
					connect: {
						id: establishmentId
					}
				},
				...(categoryId && {
					category: {
						connect: { id: categoryId }
					}
				}),
				banners: {
					set: bannerIds?.map(bannerId => ({
						id: bannerId
					}))
				},
				tags: {
					create: tagIds?.map(tagId => ({
						tag: { connect: { id: tagId } }
					}))
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
