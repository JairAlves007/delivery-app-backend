import type { FastifyInstance } from "fastify";
import {
	myOrders,
	find,
	store,
	cancel
} from "@/controllers/order.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";

const orderMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_OWN_ORDERS])
	]
};

export const orderRoutes = async (app: FastifyInstance) => {
	app.get("/:establishmentId/my", orderMiddlewares, myOrders);
	app.get("/:id", orderMiddlewares, find(false));
	app.post("/", orderMiddlewares, store);
	app.put("/cancel/:id", orderMiddlewares, cancel);
};
