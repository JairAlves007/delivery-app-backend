import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { DeletePromotionService } from "@/services/promotion/delete-promotion-service.js";

export const makeDeletePromotionService = () => {
  return new DeletePromotionService(makePromotionRepository());
};
