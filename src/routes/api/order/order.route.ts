import {
	cancel,
	find,
	myOrders,
	store
} from "@/controllers/order.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

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
