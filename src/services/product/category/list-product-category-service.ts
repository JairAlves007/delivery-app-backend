import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import {
	ProductCategoryFromRepository,
	ProductCategoryList
} from "@/types/product-category.ts";
import z from "zod";

type ListProductCategoryServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListProductCategoryServiceResponse
	extends Pick<ListProductCategoryServiceRequest, "page"> {
	productCategories: ProductCategoryList[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	private mapProductCategories(
		productCategories: ProductCategoryFromRepository[]
	): ProductCategoryList[] {
		return productCategories.map(productCategory => {
			return {
				...productCategory,
				resources: mapObjectResourcesList(productCategory.resources)
			};
		});
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
			async () =>
				await this.productCategoryRepository.count({
					establishment_id: establishmentId
				})
		);

		if (isPaging) {
			const [total, productCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.productCategories}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.productCategoryRepository.paginate({
							page,
							perPage,
							filterParams: { establishment_id: establishmentId }
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				productCategories: this.mapProductCategories(productCategories),
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
					await this.productCategoryRepository.listAll({
						establishment_id: establishmentId
					})
			)
		]);

		return {
			productCategories: this.mapProductCategories(productCategories),
			page,
			total
		};
	}
}
