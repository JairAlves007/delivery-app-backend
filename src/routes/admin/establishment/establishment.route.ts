import {
	destroy,
	index,
	store,
	update
} from "@/controllers/establishment.controller";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission";
import { isAuthenticated } from "@/middlewares/is-auth";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance, FastifyRequest } from "fastify";

const establishmentMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS])
	]
};

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.get("/", establishmentMiddlewares, index);

	app.post("/", establishmentMiddlewares, store);

	app.patch("/:id", establishmentMiddlewares, update);

	app.delete("/:id", establishmentMiddlewares, destroy);
};
