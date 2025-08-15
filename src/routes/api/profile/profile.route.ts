import { me } from "@/controllers/user.controller.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

const meMiddlewares = {
	onRequest: [isAuthenticated]
};

export const profileRoutes = async (app: FastifyInstance) => {
	app.get("/", meMiddlewares, me);
};
