import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { ProductCategory } from "@prisma/client";
import z from "zod";

type ListProductCategoryServiceRequest = z.infer<
	typeof paginationQueryParamsSchema
>;

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
		perPage
	}: ListProductCategoryServiceRequest): Promise<ListProductCategoryServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			"total_product_categories",
			async () => await this.productCategoryRepository.count()
		);

		if (isPaging) {
			const [total, productCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`product_categories_page_${page}_per_page_${perPage}`,
					async () =>
						await this.productCategoryRepository.paginate(page, perPage)
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
				"all_product_categories",
				async () => await this.productCategoryRepository.listAll()
			)
		]);

		return {
			productCategories,
			page,
			total
		};
	}
}
