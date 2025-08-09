import { signIn, signUp } from "@/controllers/user.controller";
import { ensureRoleRequest } from "@/hooks/ensure-role-request";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", (request, reply) =>
		signIn(request, reply, [RoleType.CLIENT])
	);
	app.post("/sign-up", {
		preHandler: [(req, res) => ensureRoleRequest(req, res, RoleType.CLIENT)],
		handler: signUp
	});
};
