import type { FastifyInstance } from "fastify";
import { adminRoutes } from "./admin/index.ts";
import { apiRoutes } from "./api/index.ts";
import { healthRoutes } from "./health/health.route.ts";

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
