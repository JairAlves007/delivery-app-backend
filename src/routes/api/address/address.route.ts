import {
	destroy,
	index,
	store,
	update
} from "@/controllers/address.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const addressMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES])
	]
};

export const addressRoutes = (app: FastifyInstance) => {
	app.get("/", addressMiddlewares, index);
	app.post("/", addressMiddlewares, store);
	app.patch("/:id", addressMiddlewares, update);
	app.delete("/:id", addressMiddlewares, destroy);
};
