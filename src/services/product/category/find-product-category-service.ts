import z from "zod";

import { ProductCategoryNotFound } from "@/errors/product/category/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { productCategoryParamsSchema } from "@/schemas/product-category-schema.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductCategoryList } from "@/types/product-category.js";

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
	}: FindProductCategoryServiceRequest): Promise<ProductCategoryList> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.productCategories}_${id}`;

		const productCategory = await cache.rememberForever(
			key,
			async () =>
				await this.productCategoryRepository.findById({ id, filterParams })
		);

		if (!productCategory) throw new ProductCategoryNotFound();

		return {
			...productCategory,
			resources: mapObjectResourcesList(productCategory.resources)
		};
	}
}
