import { ProductCategoryNotFound } from "@/errors/product/category/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { productCategoryParamsSchema } from "@/schemas/product-category-schema.ts";
import { ProductCategory } from "@prisma/client";
import z from "zod";

type FindProductCategoryServiceRequest = z.infer<
	typeof productCategoryParamsSchema
>;

export class FindProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		id
	}: FindProductCategoryServiceRequest): Promise<ProductCategory> {
		const cache = makeCache();
		const key = `${cache.keys.productCategories}_${id}`;

		const productCategory = await cache.rememberForever(
			key,
			async () => await this.productCategoryRepository.findById({ id })
		);

		if (!productCategory) {
			await cache.forget(key);
			throw new ProductCategoryNotFound();
		}

		return productCategory;
	}
}
