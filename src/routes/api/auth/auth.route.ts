import {
	forgotPassword,
	resetPassword,
	signIn,
	signUp
} from "@/controllers/user.controller.ts";
import { RoleType } from "@/generated/prisma/client.ts";
import type { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.CUSTOMER]));
	app.post("/sign-up", signUp(RoleType.CUSTOMER));
	app.post("/forgot-password", forgotPassword);
	app.post("/reset-password", resetPassword);
};
