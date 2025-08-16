import type { FastifyInstance } from "fastify";
import { adminAuthRoutes } from "./auth/auth.route.ts";
import { establishmentRoutes } from "./establishment/establishment.route.ts";
import { adminProductsRoutes } from "./products/products.route.ts";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
			api.register(establishmentRoutes, { prefix: "/establishment" });
			api.register(adminProductsRoutes, { prefix: "/products" });
		},
		{ prefix: "/admin" }
	);
};
