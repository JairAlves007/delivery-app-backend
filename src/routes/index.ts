import { adminRoutes } from "./admin";
import { apiRoutes } from "./api";
import { healthRoutes } from "./health/health.route";
import type { FastifyInstance } from "fastify/types/instance";

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
