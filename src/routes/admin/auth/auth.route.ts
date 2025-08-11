import { signIn, signUp } from "@/controllers/user.controller";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles";
import { isAuthenticated } from "@/middlewares/is-auth";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const authMiddlewares = {
	onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.ADMIN])]
};

export const adminAuthRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.ADMIN, RoleType.ESTABLISHMENT_OWNER]));
	app.post("/sign-up", authMiddlewares, signUp(RoleType.ESTABLISHMENT_OWNER));
};
