import { signIn, signUp } from "@/controllers/admin/userAdmin.controller";
import { ensureAuthenticated } from "@/hooks/ensure-authenticated";
import { ensureRoleRequest } from "@/hooks/ensure-role-request";
import { ensureHasRoles } from "@/hooks/ensure-has-roles";
import { RoleType } from "@prisma/client";
import { FastifyInstance } from "fastify";

const adminSignUpGuards = [
	ensureAuthenticated,
	(req: any, res: any) => ensureHasRoles(req, res, [RoleType.ADMIN]),
	(req: any, res: any) =>
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
