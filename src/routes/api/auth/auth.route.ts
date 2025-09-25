import {
	forgotPassword,
	resetPassword,
	signIn,
	signUp
} from "@/controllers/user.controller.ts";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.ts";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.CUSTOMER]));
	app.post("/sign-up", signUp(RoleType.CUSTOMER));
	app.post("/forgot-password", forgotPassword);
	app.post("/reset-password", resetPassword);
};
