import type { FastifyInstance } from "fastify";

import { listBannersCatalogRoute } from "./list-banners-catalog.route.js";
import { listProductCategoriesCatalogRoute } from "./list-product-categories-catalog.route.js";
import { listProductsFromCategoryCatalogRoute } from "./list-products-from-category-catalog.route.js";

export const mainRoutes = async (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(listBannersCatalogRoute);
			api.register(listProductCategoriesCatalogRoute);
			api.register(listProductsFromCategoryCatalogRoute);
		},
		{ prefix: "/home/:establishmentId" }
	);
};
