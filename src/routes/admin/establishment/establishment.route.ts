import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/establishment.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const establishmentMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS])
	]
};

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.get("/", establishmentMiddlewares, index);
	app.get("/:id", establishmentMiddlewares, find);
	app.post("/", establishmentMiddlewares, store);
	app.patch("/:id", establishmentMiddlewares, update);
	app.delete("/:id", establishmentMiddlewares, destroy);
};
