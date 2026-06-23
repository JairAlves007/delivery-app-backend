import z from "zod";

export const createRecommendationBodySchema = z
  .object({
    productId: z.ulid("O produto deve ser preenchido"),
    recommendedProductId: z.ulid("O produto recomendado deve ser preenchido"),
  })
  .refine((data) => data.productId !== data.recommendedProductId, {
    path: ["recommendedProductId"],
    message: "O produto recomendado deve ser diferente do produto",
  });

z.globalRegistry.add(createRecommendationBodySchema, {
  id: "CreateRecommendationBody",
});

export const recommendationParamsSchema = z.object({
  id: z.ulid("O id deve ser preenchido"),
});
