import { establishmentParamsSchema } from "./generic-schema.js";
import { productCategoryParamsSchema } from "./product-category-schema.js";

export const listProductsFromCategorySchema = establishmentParamsSchema.extend({
	categoryId: productCategoryParamsSchema.shape.id
});
