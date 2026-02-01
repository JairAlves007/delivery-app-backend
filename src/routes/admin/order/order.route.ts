import { find, index, update } from "@/controllers/order.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

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
