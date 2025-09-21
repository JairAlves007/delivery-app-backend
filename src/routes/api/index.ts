import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/auth.route.ts";
import { mainRoutes } from "./main/main.route.ts";
import { uploadRoutes } from "./upload/upload.route.ts";
import { couponRoutes } from "./coupon/coupon.route.ts";
import { establishmentRoutes } from "./establishment/establishment.route.ts";
import { addressRoutes } from "./address/address.route.ts";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(mainRoutes, { prefix: "/main" });
		api.register(uploadRoutes, { prefix: "/upload" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(establishmentRoutes, { prefix: "/establishment" });
		api.register(addressRoutes, { prefix: "/address" });
	});
};
