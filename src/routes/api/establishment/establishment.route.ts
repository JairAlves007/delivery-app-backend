import { catalog } from "@/controllers/establishment.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const establishmentMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.VIEW_CATALOG])
	]
};

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.get("/:id/catalog", establishmentMiddlewares, catalog);
};
