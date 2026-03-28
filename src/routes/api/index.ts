import type { FastifyInstance } from "fastify";

import { addressRoutes } from "./address/address.route.js";
import { authRoutes } from "./auth/auth.route.js";
import { couponRoutes } from "./coupon/coupon.route.js";
import { mainRoutes } from "./main/main.route.js";
import { orderRoutes } from "./order/order.route.js";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(authRoutes, { prefix: "/auth" });
		api.register(mainRoutes, { prefix: "/main" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(addressRoutes, { prefix: "/address" });
		api.register(orderRoutes, { prefix: "/order" });
	});
};
