import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/auth.route";
import { profileRoutes } from "./profile/profile.route";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(profileRoutes, { prefix: "/me" });
	});
};
