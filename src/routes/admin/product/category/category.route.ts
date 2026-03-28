import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/product-category.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const categoriesMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_CATEGORIES])
	]
};

export const adminProductCategoryRoutes = async (app: FastifyInstance) => {
	app.get("/", categoriesMiddlewares, index);
	app.get("/:id", categoriesMiddlewares, find);
	app.post("/", categoriesMiddlewares, store);
	app.patch("/:id", categoriesMiddlewares, update);
	app.delete("/:id", categoriesMiddlewares, destroy);
};
