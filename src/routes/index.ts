import { adminRoutes } from "./admin";
import { apiRoutes } from "./api";
import { authRoutes } from "./admin/auth/auth.route";
import { healthRoutes } from "./health/health.route";
import { FastifyInstance } from "fastify";

export const routes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(healthRoutes);
			api.register(adminRoutes);
			api.register(apiRoutes);
		},
		{ prefix: "/api" }
	);
};
