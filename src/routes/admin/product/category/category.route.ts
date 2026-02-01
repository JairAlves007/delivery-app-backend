import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/product-category.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

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
