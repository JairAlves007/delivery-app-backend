import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { ProductCategory } from "@prisma/client";
import z from "zod";

type ListProductCategoryServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListProductCategoryServiceResponse
	extends Pick<ListProductCategoryServiceRequest, "page"> {
	productCategories: ProductCategory[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		page,
		perPage,
		establishmentId
	}: ListProductCategoryServiceRequest): Promise<ListProductCategoryServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.productCategories}`,
			async () => await this.productCategoryRepository.count(establishmentId)
		);

		if (isPaging) {
			const [total, productCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.productCategories}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.productCategoryRepository.paginate(
							page,
							perPage,
							establishmentId
						)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				productCategories,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, productCategories] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.productCategories}`,
				async () =>
					await this.productCategoryRepository.listAll(establishmentId)
			)
		]);

		return {
			productCategories,
			page,
			total
		};
	}
}
