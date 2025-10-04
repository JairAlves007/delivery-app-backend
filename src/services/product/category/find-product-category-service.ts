import { ProductCategoryNotFound } from "@/errors/product/category/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { productCategoryParamsSchema } from "@/schemas/product-category-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { ProductCategoryFromRepository } from "@/types/product-category.ts";
import z from "zod";

type FindProductCategoryServiceRequest = z.infer<
	typeof productCategoryParamsSchema
> &
	FilterField;

export class FindProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		id,
		filterParams
	}: FindProductCategoryServiceRequest): Promise<ProductCategoryFromRepository> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.productCategories}_${id}`;

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
