import { index, store } from "@/controllers/establishment.controller";
import { ensureUserHasPermission } from "@/hooks/ensure-user-has-permission";
import { isAuthenticated } from "@/hooks/is-auth";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance, FastifyRequest } from "fastify";

const adminEstablishmentGuards = [
	isAuthenticated,
	(req: FastifyRequest) =>
		ensureUserHasPermission(req, PermissionType.MANAGE_ESTABLISHMENTS)
];

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.get("/", {
		preHandler: adminEstablishmentGuards,
		handler: index
	});

	app.post("/", {
		preHandler: adminEstablishmentGuards,
		handler: store
	});
};
