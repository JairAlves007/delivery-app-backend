import { index } from "@/controllers/establishment.controller";
import { ensureUserHasPermission } from "@/hooks/ensure-user-has-permission";
import { isAuthenticated } from "@/hooks/is-auth";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.get("/", {
		preHandler: [
			isAuthenticated,
			(req, res) =>
				ensureUserHasPermission(req, PermissionType.MANAGE_ESTABLISHMENTS)
		],
		handler: index
	});
};
