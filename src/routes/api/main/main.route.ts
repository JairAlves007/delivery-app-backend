import {
	listBannersCatalog,
	listProductCategoriesCatalog,
	listProductsFromCategoryCatalog,
	main
} from "@/controllers/main.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const mainMiddlewares = {
	onRequest: [isAuthenticated]
};

const homeMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.VIEW_CATALOG])
	]
};

export const mainRoutes = async (app: FastifyInstance) => {
	app.get("/:slug", mainMiddlewares, main);

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
