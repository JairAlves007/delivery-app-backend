import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { AddonCategory } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListAddonCategoryServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListAddonCategoryServiceResponse = PaginatedResponse<AddonCategory>;

export class ListAddonCategoryService {
  private addonCategoryRepository: IAddonCategoryRepository;

  constructor(addonCategoryRepository: IAddonCategoryRepository) {
    this.addonCategoryRepository = addonCategoryRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListAddonCategoryServiceRequest): Promise<ListAddonCategoryServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.addonCategories}`,
      Constants.CACHE_TTL.addonCategories,
      async () => await this.addonCategoryRepository.count(filterParams),
      {
        domain: "addonCategories",
        establishmentId: filterParams?.establishment_id,
      },
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
              filterParams,
            }),
          {
            domain: "addonCategories",
            establishmentId: filterParams?.establishment_id,
          },
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: addonCategories,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, addonCategories] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.addonCategories}`,
        Constants.CACHE_TTL.addonCategories,
        async () => await this.addonCategoryRepository.listAll(filterParams),
        {
          domain: "addonCategories",
          establishmentId: filterParams?.establishment_id,
        },
      ),
    ]);

    return {
      items: addonCategories,
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
