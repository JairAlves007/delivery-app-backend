import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { CreatePromotionService } from "@/services/promotion/create-promotion-service.js";

export const makeCreatePromotionService = () => {
  return new CreatePromotionService(makePromotionRepository());
};
