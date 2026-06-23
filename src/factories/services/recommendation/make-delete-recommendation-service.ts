import { makeProductRecommendationRepository } from "@/factories/repositories/make-product-recommendation-repository.js";
import { DeleteRecommendationService } from "@/services/recommendation/delete-recommendation-service.js";

export const makeDeleteRecommendationService = () => {
  return new DeleteRecommendationService(
    makeProductRecommendationRepository(),
  );
};
