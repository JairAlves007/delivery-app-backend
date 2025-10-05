import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/order.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const orderMiddlewares = {
	onRequest: [
		isAuthenticated
		//ensureUserHasPermission([PermissionType.MANAGE_ORDERS])
	]
};

export const adminOrderRoutes = async (app: FastifyInstance) => {
	app.get("/", orderMiddlewares, index);
	app.get("/:id", orderMiddlewares, find);
	app.post("/", orderMiddlewares, store);
	app.put("/:id", orderMiddlewares, update);
	app.delete("/:id", orderMiddlewares, destroy);
};
