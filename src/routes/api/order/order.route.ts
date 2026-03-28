import type { FastifyInstance } from "fastify";

import {
	cancel,
	find,
	myOrders,
	store
} from "@/controllers/order.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

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
