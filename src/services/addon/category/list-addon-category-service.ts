import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { AddonCategory } from "@prisma/client";
import z from "zod";

type ListAddonCategoryServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListAddonCategoryServiceResponse
	extends Pick<ListAddonCategoryServiceRequest, "page"> {
	addonCategories: AddonCategory[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		page,
		perPage,
		filterParams
	}: ListAddonCategoryServiceRequest): Promise<ListAddonCategoryServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.addonCategories}`,
			async () => await this.addonCategoryRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.addonCategories}_page_${page}_per_page_${perPage}`;
			const [total, addonCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.addonCategoryRepository.paginate({
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
				addonCategories,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, addonCategories] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.addonCategories}`,
				async () => await this.addonCategoryRepository.listAll(filterParams)
			)
		]);

		return {
			addonCategories,
			page,
			total
		};
	}
}
