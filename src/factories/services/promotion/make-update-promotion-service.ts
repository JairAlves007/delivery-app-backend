import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { UpdatePromotionService } from "@/services/promotion/update-promotion-service.js";

export const makeUpdatePromotionService = () => {
  return new UpdatePromotionService(makePromotionRepository());
};
