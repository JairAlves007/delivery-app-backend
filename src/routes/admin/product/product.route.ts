import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/product.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const productsMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS])
	]
};

export const adminProductRoutes = async (app: FastifyInstance) => {
	app.get("/", productsMiddlewares, index);
	app.get("/:id", productsMiddlewares, find);
	app.post("/", productsMiddlewares, store);
	app.patch("/:id", productsMiddlewares, update);
	app.delete("/:id", productsMiddlewares, destroy);
};
