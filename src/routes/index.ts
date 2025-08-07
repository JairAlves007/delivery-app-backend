import { adminRoutes } from "./admin";
import { healthRoutes } from "./health/health.route";
import { FastifyInstance } from "fastify";

export const routes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(healthRoutes);
			api.register(adminRoutes);
		},
		{ prefix: "/api" }
	);
};
