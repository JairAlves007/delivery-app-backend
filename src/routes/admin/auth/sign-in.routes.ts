import { signIn } from "@/controllers/admin/userAdmin.controller";
import { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
	app.post("/sign-in", signIn);
};
