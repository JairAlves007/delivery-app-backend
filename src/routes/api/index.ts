import type { FastifyInstance } from "fastify/types/instance";
import { authRoutes } from "./auth/auth.route";
import { profileRoutes } from "./profile/profile.route";
import { uploadRoutes } from "./upload/upload.route";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(profileRoutes, { prefix: "/me" });
		api.register(uploadRoutes, { prefix: "/upload" });
	});
};
