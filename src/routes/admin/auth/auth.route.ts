import { signIn, signUp } from "@/controllers/admin/userAdmin.controller";
import { ensureRoleRequest } from "@/hooks/ensure-role-request";
import { ensureUserHasRoles } from "@/hooks/ensure-user-has-roles";
import { isAuthenticated } from "@/hooks/is-auth";
import { RoleType } from "@prisma/client";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const adminSignUpGuards = [
	isAuthenticated,
	(req: FastifyRequest, res: FastifyReply) =>
		ensureUserHasRoles(req, res, [RoleType.ADMIN]),
	(req: FastifyRequest, res: FastifyReply) =>
		ensureRoleRequest(req, res, RoleType.ESTABLISHMENT_OWNER)
];

export const adminAuthRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", (request, reply) =>
		signIn(request, reply, [RoleType.ADMIN, RoleType.ESTABLISHMENT_OWNER])
	);
	app.post("/sign-up", {
		preHandler: adminSignUpGuards,
		handler: signUp
	});
};
