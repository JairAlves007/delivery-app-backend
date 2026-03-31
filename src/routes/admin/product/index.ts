import type { FastifyInstance } from "fastify";

import { adminProductCategoryRoutes } from "./category/index.js";
import { createProductRoute } from "./create-product.route.js";
import { deleteProductRoute } from "./delete-product.route.js";
import { findProductRoute } from "./find-product.route.js";
import { listProductsRoute } from "./list-products.route.js";
import { updateProductRoute } from "./update-product.route.js";

export const adminProductRoutes = async (app: FastifyInstance) => {
	app.register(listProductsRoute);
	app.register(findProductRoute);
	app.register(createProductRoute);
	app.register(updateProductRoute);
	app.register(deleteProductRoute);

	app.register(adminProductCategoryRoutes, { prefix: "/categories" });
};
