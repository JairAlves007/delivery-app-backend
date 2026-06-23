import { makeProductRecommendationRepository } from "@/factories/repositories/make-product-recommendation-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { CreateManualRecommendationService } from "@/services/recommendation/create-manual-recommendation-service.js";

export const makeCreateManualRecommendationService = () => {
  return new CreateManualRecommendationService(
    makeProductRecommendationRepository(),
    makeProductRepository(),
  );
};
