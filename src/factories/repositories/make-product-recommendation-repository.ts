import { ProductRecommendationPrismaRepository } from "@/repositories/product-recommendation-prisma-repository.js";

export const makeProductRecommendationRepository = () => {
  return new ProductRecommendationPrismaRepository();
};
