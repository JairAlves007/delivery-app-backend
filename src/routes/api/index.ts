import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/auth.route.ts";
import { profileRoutes } from "./profile/profile.route.ts";
import { uploadRoutes } from "./upload/upload.route.ts";
import { couponRoutes } from "./coupon/coupon.route.ts";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(profileRoutes, { prefix: "/me" });
		api.register(uploadRoutes, { prefix: "/upload" });
		api.register(couponRoutes, { prefix: "/coupon" });
	});
};
