import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { addonParamsSchema } from "@/schemas/addon-schema.ts";
import type { AddonCategoryFromRepository } from "@/types/addon-category.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

type FindAddonCategoryServiceRequest = z.infer<typeof addonParamsSchema> &
	FilterField;

export class FindAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		id,
		filterParams
	}: FindAddonCategoryServiceRequest): Promise<AddonCategoryFromRepository> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);

		const key = `${filterPrefixKey}${cache.keys.addonCategories}_${id}`;

		const addonCategory = await cache.rememberForever(
			key,
			async () =>
				await this.addonCategoryRepository.findById({ id, filterParams })
		);

		if (!addonCategory) throw new AddonCategoryNotFound();

		return addonCategory;
	}
}
