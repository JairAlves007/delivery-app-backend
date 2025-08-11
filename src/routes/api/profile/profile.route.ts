import { me } from "@/controllers/user.controller";
import { isAuthenticated } from "@/middlewares/is-auth";
import type { FastifyInstance } from "fastify";

const meMiddlewares = {
	onRequest: [isAuthenticated]
};

export const profileRoutes = async (app: FastifyInstance) => {
	app.get("/", meMiddlewares, me);
};
