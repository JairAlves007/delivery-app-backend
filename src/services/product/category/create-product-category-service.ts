import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { createProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import z from "zod";

type CreateProductCategoryServiceRequest = z.infer<
	typeof createProductCategoryBodySchema
>;

export class CreateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		establishmentId,
		bannerIds,
		...data
	}: CreateProductCategoryServiceRequest) {
		const cache = makeCache();

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

		await cache.forgetKeysContaining(cache.keys.productCategories);
	}
}
