import type { FastifyInstance } from "fastify";

import {
	listBannersCatalog,
	listProductCategoriesCatalog,
	listProductsFromCategoryCatalog
} from "@/controllers/main.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const homeMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.VIEW_CATALOG])
	]
};

export const mainRoutes = async (app: FastifyInstance) => {
	app.register(
		async api => {
			api.get("/banners", homeMiddlewares, listBannersCatalog);
			api.get(
				"/product/categories",
				homeMiddlewares,
				listProductCategoriesCatalog
			);
			api.get(
				"/category/:categoryId/products",
				homeMiddlewares,
				listProductsFromCategoryCatalog
			);
		},
		{ prefix: "/home/:establishmentId" }
	);
};
