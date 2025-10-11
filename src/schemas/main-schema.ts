import z from "zod";
import { establishmentParamsSchema } from "./generic-schema.ts";
import { productCategoryParamsSchema } from "./product-category-schema.ts";

export const mainParamsSchema = z.object({
	slug: z.string().min(1, "O slug deve ser preenchido")
});

export const listProductsFromCategorySchema = establishmentParamsSchema.extend({
	categoryId: productCategoryParamsSchema.shape.id
});
