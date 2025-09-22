import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Product } from "@prisma/client";
import z from "zod";

type ListProductServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListProductServiceResponse
	extends Pick<ListProductServiceRequest, "page"> {
	products: Product[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	private mapProducts(products: Product[]) {
		return products.map(product => {
			return {
				...product,
				price: transformPriceFromDatabase(product.price)
			};
		});
	}

	async handle({
		page,
		perPage,
		establishmentId
	}: ListProductServiceRequest): Promise<ListProductServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.products}`,
			async () =>
				await this.productRepository.count({
					establishment_id: establishmentId
				})
		);

		if (isPaging) {
			const [total, products] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.products}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.productRepository.paginate({
							page,
							perPage,
							filterParams: { establishment_id: establishmentId }
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

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
				async () =>
					await this.productRepository.listAll({
						establishment_id: establishmentId
					})
			)
		]);

		return {
			products: this.mapProducts(products),
			page,
			total
		};
	}
}
