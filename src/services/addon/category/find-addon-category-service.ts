import z from "zod";

import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { addonParamsSchema } from "@/schemas/addon-schema.js";
import type { AddonCategoryFromRepository } from "@/types/addon-category.js";
import type { FilterField } from "@/types/crud.js";

type FindAddonCategoryServiceRequest = z.infer<typeof addonParamsSchema> &
  FilterField;

export class FindAddonCategoryService {
  private addonCategoryRepository: IAddonCategoryRepository;

  constructor(addonCategoryRepository: IAddonCategoryRepository) {
    this.addonCategoryRepository = addonCategoryRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindAddonCategoryServiceRequest): Promise<AddonCategoryFromRepository> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);

    const key = `${filterPrefixKey}${cache.keys.addonCategories}_${id}`;

    const addonCategory = await cache.remember(
      key,
      Constants.CACHE_TTL.addonCategories,
      async () =>
        await this.addonCategoryRepository.findById({ id, filterParams }),
    );

    if (!addonCategory) throw new AddonCategoryNotFound();

    return addonCategory;
  }
}
