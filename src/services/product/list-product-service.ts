import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { ProductFromRepository, ProductList } from "@/types/product.ts";
import z from "zod";

type ListProductServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListProductServiceResponse
	extends Pick<ListProductServiceRequest, "page"> {
	products: ProductList[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListProductService {
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

	async handle({
		page,
		perPage,
		filterParams
	}: ListProductServiceRequest): Promise<ListProductServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.products}`,
			async () => await this.productRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.products}_page_${page}_per_page_${perPage}`;
			const [total, products] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.productRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				products: this.mapProducts(products),
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, products] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.products}`,
				async () => await this.productRepository.listAll(filterParams)
			)
		]);

		return {
			products: this.mapProducts(products),
			page,
			total
		};
	}
}
