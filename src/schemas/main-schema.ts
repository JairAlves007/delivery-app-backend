import z from "zod";

import { listQueryParamsSchema } from "./generic-schema.js";
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

export const searchProductsCatalogQuerySchema = listQueryParamsSchema.extend({
  search: z
    .string()
    .trim()
    .min(1, "O termo de busca deve ser preenchido")
    .max(255),
  categoryId: productCategoryParamsSchema.shape.id.optional().nullable(),
  similarityThreshold: z.coerce
    .number()
    .min(0)
    .max(1)
    .optional()
    .nullable(),
});
