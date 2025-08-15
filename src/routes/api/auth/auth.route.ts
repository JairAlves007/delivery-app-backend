import { signIn, signUp } from "@/controllers/user.controller.ts";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.CLIENT]));
	app.post("/sign-up", signUp(RoleType.CLIENT));
};
