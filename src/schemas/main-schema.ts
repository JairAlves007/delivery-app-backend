import z from "zod";

import { productCategoryParamsSchema } from "./product-category-schema.js";
import { productParamsSchema } from "./product-schema.js";

export const listProductsFromCategorySchema = z.object({
  categoryId: productCategoryParamsSchema.shape.id,
});

export const listSuggestedProductsParamsSchema = z.object({
  productId: productParamsSchema.shape.id,
});

export const listSuggestedProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
