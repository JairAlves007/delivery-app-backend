import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.ts";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.ts";
import type { ProductFromRepository, ProductList } from "@/types/product.ts";
import z from "zod";

type ListProductsFromCategoryCatalogServiceRequest = z.infer<
	typeof listCursorQueryParamsSchema
> &
	z.infer<typeof listProductsFromCategorySchema>;

interface ListProductsFromCategoryCatalogServiceResponse {
	products: ProductList[];
	pagination: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export class ListProductsFromCategoryCatalogService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	private mapProducts(products: ProductFromRepository[]): ProductList[] {
		return products.map(product => {
			return {
				...product,
				price: transformPriceFromDatabase(product.price),
				resources: mapObjectResourcesList(product.resources)
			};
		});
	}

	public async handle({
		establishmentId,
		categoryId,
		limit,
		cursor
	}: ListProductsFromCategoryCatalogServiceRequest): Promise<ListProductsFromCategoryCatalogServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
		const filterParams = {
			establishment_id: establishmentId,
			category_id: categoryId
		};
		const key = [
			getFilterParamsCacheKey(filterParams),
			cache.keys.productCategories,
			categoryId,
			cache.keys.products,
			"limit",
			limit,
			cursorSuffix
		].join("_");

		const raw = await cache.rememberForever(
			key,
			async () =>
				await this.productRepository.cursorPaginate({
					limit,
					cursor,
					filterParams
				})
		);
		const hasNextPage = raw.length > limit;
		const products = hasNextPage ? raw.slice(0, limit) : raw;
		const nextCursor = hasNextPage ? products[products.length - 1].id : null;

		if (products.length <= 0) await cache.forget(key);

		return {
			products: this.mapProducts(products),
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
