import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { FindPromotionService } from "@/services/promotion/find-promotion-service.js";

export const makeFindPromotionService = () => {
  return new FindPromotionService(makePromotionRepository());
};
