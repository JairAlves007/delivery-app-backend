import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/product.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

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
