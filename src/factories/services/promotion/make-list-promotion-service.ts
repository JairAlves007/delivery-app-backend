import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { ListPromotionService } from "@/services/promotion/list-promotion-service.js";

export const makeListPromotionService = () => {
  return new ListPromotionService(makePromotionRepository());
};
