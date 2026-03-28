import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createProductCategoryBodySchema } from "@/schemas/product-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateProductCategoryServiceRequest = z.infer<
	typeof createProductCategoryBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		establishmentId,
		bannerIds,
		paramsToForget,
		...data
	}: CreateProductCategoryServiceRequest) {
		await this.productCategoryRepository.create({
			...data,
			slug: slugify(data.name),
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			banners: {
				connect: bannerIds?.map(bannerId => ({ id: bannerId }))
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "productCategories",
			paramsToForget
		});
	}
}
