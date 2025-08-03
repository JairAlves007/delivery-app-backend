import { FastifyInstance } from "fastify";
import { healthRoutes } from "./health/health";

export const routes = (server: FastifyInstance) => {
	server.register(
		async api => {
			api.register(healthRoutes);
		},
		{ prefix: "/api" }
	);
};
