import z from "zod";

import { PromotionNotFound } from "@/errors/promotion/not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import { promotionParamsSchema } from "@/schemas/promotion-schema.js";
import type { FilterField } from "@/types/crud.js";
import type { PromotionWithRelations } from "@/types/promotion.js";

type FindPromotionServiceRequest = z.infer<typeof promotionParamsSchema> &
  FilterField;

export class FindPromotionService {
  private promotionRepository: IPromotionRepository;

  constructor(promotionRepository: IPromotionRepository) {
    this.promotionRepository = promotionRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindPromotionServiceRequest): Promise<PromotionWithRelations> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const key = `${filterPrefixKey}${cache.keys.promotions}_${id}`;

    const promotion = await cache.remember(
      key,
      Constants.CACHE_TTL.promotions,
      async () =>
        await this.promotionRepository.findByIdWithRelations({
          id,
          filterParams,
        }),
      { domain: "promotions", establishmentId: filterParams?.establishment_id },
    );

    if (!promotion) throw new PromotionNotFound();

    return promotion;
  }
}
