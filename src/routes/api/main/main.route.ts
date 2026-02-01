import {
	listBannersCatalog,
	listProductCategoriesCatalog,
	listProductsFromCategoryCatalog,
	profileData
} from "@/controllers/main.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
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
	app.get("/profile/data/:establishmentId", mainMiddlewares, profileData);

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
