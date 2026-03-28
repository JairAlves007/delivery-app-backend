import z from "zod";

import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { productParamsSchema } from "@/schemas/product-schema.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductFromRepository } from "@/types/product.js";

type FindProductServiceRequest = z.infer<typeof productParamsSchema> &
	FilterField;

export class FindProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	public async handle({
		id,
		filterParams
	}: FindProductServiceRequest): Promise<ProductFromRepository> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.products}_${id}`;

		const product = await cache.rememberForever(
			key,
			async () => await this.productRepository.findById({ id, filterParams })
		);

		if (!product) throw new ProductNotFound();

		return product;
	}
}
