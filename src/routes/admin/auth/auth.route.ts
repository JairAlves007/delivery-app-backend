import { signIn, signUp } from "@/controllers/admin/userAdmin.controller";
import { ensureAuthenticated } from "@/hooks/ensure-authenticated";
import { ensureRoleRequest } from "@/hooks/ensure-role-request";
import { ensureHasRoles } from "@/hooks/ensure-has-roles";
import { RoleType } from "@prisma/client";
import { FastifyInstance } from "fastify";

export const adminAuthRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn);
	app.post("/sign-up", {
		preHandler: [
			ensureAuthenticated,
			(request, reply) => ensureHasRoles(request, reply, [RoleType.ADMIN]),
			(request, reply) =>
				ensureRoleRequest(request, reply, RoleType.ESTABLISHMENT_OWNER)
		],
		handler: signUp
	});
};
