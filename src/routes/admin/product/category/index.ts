import type { FastifyInstance } from "fastify";

import { createProductCategoryRoute } from "./create-product-category.route.js";
import { deleteProductCategoryRoute } from "./delete-product-category.route.js";
import { findProductCategoryRoute } from "./find-product-category.route.js";
import { listProductCategoriesRoute } from "./list-product-categories.route.js";
import { updateProductCategoryRoute } from "./update-product-category.route.js";

export const adminProductCategoryRoutes = async (app: FastifyInstance) => {
	app.register(listProductCategoriesRoute);
	app.register(findProductCategoryRoute);
	app.register(createProductCategoryRoute);
	app.register(updateProductCategoryRoute);
	app.register(deleteProductCategoryRoute);
};
