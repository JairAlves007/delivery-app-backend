import { makeProductRecommendationRepository } from "@/factories/repositories/make-product-recommendation-repository.js";
import { ListManualRecommendationsService } from "@/services/recommendation/list-manual-recommendations-service.js";

export const makeListManualRecommendationsService = () => {
  return new ListManualRecommendationsService(
    makeProductRecommendationRepository(),
  );
};
