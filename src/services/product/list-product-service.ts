import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Product } from "@prisma/client";
import z from "zod";

type ListProductServiceRequest = z.infer<typeof paginationQueryParamsSchema>;

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

	async handle({
		page,
		perPage
	}: ListProductServiceRequest): Promise<ListProductServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			"total_products",
			async () => await this.productRepository.count()
		);

		if (isPaging) {
			const [total, products] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`products_page_${page}_per_page_${perPage}`,
					async () => await this.productRepository.paginate(page, perPage)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				products,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, products] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				"all_products",
				async () => await this.productRepository.listAll()
			)
		]);

		return {
			products,
			page,
			total
		};
	}
}
