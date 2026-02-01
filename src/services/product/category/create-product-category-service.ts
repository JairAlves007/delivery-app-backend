import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { createProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

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
