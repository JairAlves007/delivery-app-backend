import z from "zod";

import { productCategoryParamsSchema } from "./product-category-schema.js";

export const listProductsFromCategorySchema = z.object({
	categoryId: productCategoryParamsSchema.shape.id
});
