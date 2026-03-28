import type { FastifyInstance } from "fastify";

import { signIn, signUp } from "@/controllers/user.controller.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const authMiddlewares = {
	onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.ADMIN])]
};

export const adminAuthRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.ADMIN, RoleType.ESTABLISHMENT_OWNER]));
	app.post("/sign-up", authMiddlewares, signUp(RoleType.ESTABLISHMENT_OWNER));
};
