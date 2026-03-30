import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { AddonCategory } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField } from "@/types/crud.js";

type ListAddonCategoryServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListAddonCategoryServiceResponse extends Pick<
	ListAddonCategoryServiceRequest,
	"page"
> {
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
		const totalPromise = cache.remember(
			`${prefixKey}total_${cache.keys.addonCategories}`,
			Constants.CACHE_TTL.addonCategories,
			async () => await this.addonCategoryRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.addonCategories}_page_${page}_per_page_${perPage}`;
			const [total, addonCategories] = await Promise.all([
				totalPromise,
				cache.remember(
					key,
					Constants.CACHE_TTL.addonCategories,
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
			cache.remember(
				`${prefixKey}all_${cache.keys.addonCategories}`,
				Constants.CACHE_TTL.addonCategories,
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
