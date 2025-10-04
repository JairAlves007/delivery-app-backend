import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { addonParamsSchema } from "@/schemas/addon-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { AddonCategory } from "@prisma/client";
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
	}: FindAddonCategoryServiceRequest): Promise<AddonCategory> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);

		const key = `${filterPrefixKey}${cache.keys.addonCategories}_${id}`;

		const addonCategory = await cache.rememberForever(
			key,
			async () => await this.addonCategoryRepository.findById({ id })
		);

		if (!addonCategory) {
			await cache.forget(key);
			throw new AddonCategoryNotFound();
		}

		return addonCategory;
	}
}
