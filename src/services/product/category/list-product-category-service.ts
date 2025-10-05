import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type {
	ProductCategoryFromRepository,
	ProductCategoryList
} from "@/types/product-category.ts";
import z from "zod";

type ListProductCategoryServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

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
		filterParams
	}: ListProductCategoryServiceRequest): Promise<ListProductCategoryServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.productCategories}`,
			async () => await this.productCategoryRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.productCategories}_page_${page}_per_page_${perPage}`;
			const [total, productCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.productCategoryRepository.paginate({
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
				async () => await this.productCategoryRepository.listAll(filterParams)
			)
		]);

		return {
			productCategories: this.mapProductCategories(productCategories),
			total
		};
	}
}
