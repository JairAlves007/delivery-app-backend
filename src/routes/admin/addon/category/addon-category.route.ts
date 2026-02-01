import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/addon-category.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

const addonCategoryMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
	]
};

export const adminAddonCategoryRoutes = async (app: FastifyInstance) => {
	app.get("/", addonCategoryMiddlewares, index);
	app.get("/:id", addonCategoryMiddlewares, find);
	app.post("/", addonCategoryMiddlewares, store);
	app.patch("/:id", addonCategoryMiddlewares, update);
	app.delete("/:id", addonCategoryMiddlewares, destroy);
};
