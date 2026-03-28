import type { FastifyInstance } from "fastify";

import { find, index, update } from "@/controllers/order.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const orderMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.CANCEL_ORDERS])
	]
};

export const adminOrderRoutes = async (app: FastifyInstance) => {
	app.get("/", orderMiddlewares, index);
	app.get("/:id", orderMiddlewares, find(true));
	app.put("/:id", orderMiddlewares, update);
};
