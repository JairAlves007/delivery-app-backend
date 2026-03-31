import type { FastifyInstance } from "fastify";

import { adminRoutes } from "./admin/index.js";
import { apiRoutes } from "./api/index.js";
import { healthRoutes } from "./health/index.js";

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
