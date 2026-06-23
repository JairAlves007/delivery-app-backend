import { PromotionPrismaRepository } from "@/repositories/promotion-prisma-repository.js";

export const makePromotionRepository = () => {
  return new PromotionPrismaRepository();
};
