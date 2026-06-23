import type { Prisma } from "@/generated/prisma/client.js";

export type ProductRecommendationWithProducts =
  Prisma.ProductRecommendationGetPayload<{
    include: {
      product: { select: { id: true; name: true } };
      recommended_product: { select: { id: true; name: true } };
    };
  }>;

export type CoOccurrenceRow = {
  establishment_id: string;
  product_id: string;
  recommended_product_id: string;
  score: number;
};
