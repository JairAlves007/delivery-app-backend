import { main } from "@/controllers/user.controller.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

const mainMiddlewares = {
	onRequest: [isAuthenticated]
};

export const mainRoutes = async (app: FastifyInstance) => {
	app.get("/:slug", mainMiddlewares, main);
};
