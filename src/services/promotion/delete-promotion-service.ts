import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeletePromotionParams = {
  id: string;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeletePromotionService {
  private promotionRepository: IPromotionRepository;

  constructor(promotionRepository: IPromotionRepository) {
    this.promotionRepository = promotionRepository;
  }

  async handle({ id, filterParams, paramsToForget }: DeletePromotionParams) {
    await this.promotionRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "promotions",
      paramsToForget,
    });
  }
}
