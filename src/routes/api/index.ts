import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/auth.route";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
	});
};
