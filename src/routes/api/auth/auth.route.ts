import { signIn, signUp } from "@/controllers/user.controller";
import { ensureRoleRequest } from "@/middlewares/ensure-role-request";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const authMiddlewares = {
	onRequest: [ensureRoleRequest(RoleType.CLIENT)]
};

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.CLIENT]));
	app.post("/sign-up", authMiddlewares, signUp);
};
