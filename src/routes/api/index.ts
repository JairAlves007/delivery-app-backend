import type { FastifyInstance } from "fastify";
import { addressRoutes } from "./address/address.route.ts";
import { authRoutes } from "./auth/auth.route.ts";
import { couponRoutes } from "./coupon/coupon.route.ts";
import { mainRoutes } from "./main/main.route.ts";
import { orderRoutes } from "./order/order.route.ts";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(mainRoutes, { prefix: "/main" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(addressRoutes, { prefix: "/address" });
		api.register(orderRoutes, { prefix: "/order" });
	});
};
