import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/addon-category.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

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
