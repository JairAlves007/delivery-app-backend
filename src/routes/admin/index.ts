import type { FastifyInstance } from "fastify/types/instance";
import { adminAuthRoutes } from "./auth/auth.route";
import { establishmentRoutes } from "./establishment/establishment.route";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
			api.register(establishmentRoutes, { prefix: "/establishment" });
		},
		{ prefix: "/admin" }
	);
};
