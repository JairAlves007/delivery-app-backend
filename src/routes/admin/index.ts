import { FastifyInstance } from "fastify";
import { adminAuthRoutes } from "./auth/auth.route";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
		},
		{ prefix: "/admin" }
	);
};
