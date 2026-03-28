import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/address.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const addressMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES])
	]
};

export const addressRoutes = (app: FastifyInstance) => {
	app.get("/", addressMiddlewares, index);
	app.get("/:id", addressMiddlewares, find);
	app.post("/", addressMiddlewares, store);
	app.patch("/:id", addressMiddlewares, update);
	app.delete("/:id", addressMiddlewares, destroy);
};
