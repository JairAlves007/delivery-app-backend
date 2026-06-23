import { makeProductRecommendationRepository } from "@/factories/repositories/make-product-recommendation-repository.js";
import { ComputeProductRecommendationsService } from "@/services/recommendation/compute-product-recommendations-service.js";

export const makeComputeProductRecommendationsService = () => {
  return new ComputeProductRecommendationsService(
    makeProductRecommendationRepository(),
  );
};
