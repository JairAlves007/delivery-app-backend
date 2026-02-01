import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { updateProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateProductCategoryRequest
	extends
		z.infer<typeof updateProductCategoryBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		id,
		name,
		establishmentId,
		bannerIds,
		paramsToForget,
		...data
	}: UpdateProductCategoryRequest) {
		await this.productCategoryRepository.update({
			id,
			data: {
				...data,
				...(!!name && { slug: slugify(name) }),
				establishment: {
					connect: {
						id: establishmentId
					}
				},
				banners: {
					set: bannerIds?.map(bannerId => ({
						id: bannerId
					}))
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "productCategories",
			paramsToForget
		});
	}
}
