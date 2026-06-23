import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { PromotionWithRelations } from "@/types/promotion.js";

type ListActivePromotionsServiceRequest = {
  establishmentId: EstablishmentID;
};

export class ListActivePromotionsService {
  private promotionRepository: IPromotionRepository;

  constructor(promotionRepository: IPromotionRepository) {
    this.promotionRepository = promotionRepository;
  }

  async handle({
    establishmentId,
  }: ListActivePromotionsServiceRequest): Promise<PromotionWithRelations[]> {
    const cache = makeCache();
    const key = `${cache.keys.promotions}_active_${establishmentId}`;

    return await cache.remember(
      key,
      Constants.CACHE_TTL.promotions,
      async () =>
        await this.promotionRepository.findActiveByEstablishment(
          establishmentId,
        ),
      { domain: "promotions", establishmentId },
    );
  }
}
