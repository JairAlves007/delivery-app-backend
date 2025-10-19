import { establishmentParamsSchema } from "./generic-schema.ts";
import { productCategoryParamsSchema } from "./product-category-schema.ts";

export const listProductsFromCategorySchema = establishmentParamsSchema.extend({
	categoryId: productCategoryParamsSchema.shape.id
});
