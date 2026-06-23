import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Promotion } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListPromotionServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListPromotionServiceResponse = PaginatedResponse<Promotion>;

export class ListPromotionService {
  private promotionRepository: IPromotionRepository;

  constructor(promotionRepository: IPromotionRepository) {
    this.promotionRepository = promotionRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListPromotionServiceRequest): Promise<ListPromotionServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.promotions}`,
      Constants.CACHE_TTL.promotions,
      async () => await this.promotionRepository.count(filterParams),
      { domain: "promotions", establishmentId: filterParams?.establishment_id },
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.promotions}_page_${page}_per_page_${perPage}`;

      const [total, promotions] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          Constants.CACHE_TTL.promotions,
          async () =>
            await this.promotionRepository.paginate({
              page,
              perPage,
              filterParams,
            }),
          {
            domain: "promotions",
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
        items: promotions,
        pagination: { page, perPage, total, totalPages },
      };
    }

    const [total, promotions] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.promotions}`,
        Constants.CACHE_TTL.promotions,
        async () => await this.promotionRepository.listAll(filterParams),
        {
          domain: "promotions",
          establishmentId: filterParams?.establishment_id,
        },
      ),
    ]);

    return {
      items: promotions,
      pagination: { page: 1, perPage: total, total, totalPages: 1 },
    };
  }
}
