import { ProductNotFound } from "@/errors/product/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { productParamsSchema } from "@/schemas/product-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { ProductFromRepository } from "@/types/product.ts";
import z from "zod";

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
			async () => await this.productRepository.findById({ id })
		);

		if (!product) {
			await cache.forget(key);
			throw new ProductNotFound();
		}

		return product;
	}
}
