import type { FastifyInstance } from "fastify";
import { adminAuthRoutes } from "./auth/auth.route.ts";
import { establishmentRoutes } from "./establishment/establishment.route.ts";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
			api.register(establishmentRoutes, { prefix: "/establishment" });
		},
		{ prefix: "/admin" }
	);
};
