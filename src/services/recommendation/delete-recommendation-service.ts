import type { IProductRecommendationRepository } from "@/interfaces/repositories/product-recommendation-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DeleteRecommendationServiceRequest = {
  id: string;
  establishmentId: EstablishmentID;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteRecommendationService {
  private productRecommendationRepository: IProductRecommendationRepository;

  constructor(
    productRecommendationRepository: IProductRecommendationRepository,
  ) {
    this.productRecommendationRepository = productRecommendationRepository;
  }

  async handle({
    id,
    establishmentId,
    paramsToForget,
  }: DeleteRecommendationServiceRequest) {
    await this.productRecommendationRepository.deleteById(id, establishmentId);

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "products",
      paramsToForget,
    });
  }
}
