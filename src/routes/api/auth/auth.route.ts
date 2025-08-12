import { signIn, signUp } from "@/controllers/user.controller";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify/types/instance";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn([RoleType.CLIENT]));
	app.post("/sign-up", signUp(RoleType.CLIENT));
};
