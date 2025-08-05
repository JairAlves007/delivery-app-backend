import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/sign-in.routes";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(authRoutes, { prefix: "/auth" });
		},
		{
			prefix: "/admin"
		}
	);
};
