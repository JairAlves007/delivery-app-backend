import {
	destroy,
	index,
	store,
	update
} from "@/controllers/addon-category.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const addonCategoryMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
	]
};

export const adminAddonCategoryRoutes = async (app: FastifyInstance) => {
	app.get("/", addonCategoryMiddlewares, index);
	app.post("/", addonCategoryMiddlewares, store);
	app.patch("/:id", addonCategoryMiddlewares, update);
	app.delete("/:id", addonCategoryMiddlewares, destroy);
};
