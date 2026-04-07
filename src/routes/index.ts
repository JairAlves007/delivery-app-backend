import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { adminRoutes } from "./admin/index.js";
import { apiRoutes } from "./api/index.js";
import { healthRoutes } from "./health/index.js";

export const routes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(healthRoutes);
			api.register(adminRoutes);
			api.register(apiRoutes);
			api.withTypeProvider<ZodTypeProvider>().route({
				method: "GET",
				url: "/swagger.json",
				schema: {
					hide: true
				},
				handler: async () => {
					return app.swagger();
				}
			});
		},
		{ prefix: "/api" }
	);
};
