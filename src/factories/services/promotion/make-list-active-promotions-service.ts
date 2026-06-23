import { makePromotionRepository } from "@/factories/repositories/make-promotion-repository.js";
import { ListActivePromotionsService } from "@/services/promotion/list-active-promotions-service.js";

export const makeListActivePromotionsService = () => {
  return new ListActivePromotionsService(makePromotionRepository());
};
