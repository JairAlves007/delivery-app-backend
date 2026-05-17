import type { FastifyInstance } from "fastify";

import { couponRoutes } from "./coupon/index.js";
import { districtCatalogRoutes } from "./district/index.js";
import { mainRoutes } from "./main/index.js";
import { orderRoutes } from "./order/index.js";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.register(mainRoutes, { prefix: "/main" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(orderRoutes, { prefix: "/order" });
		api.register(districtCatalogRoutes, { prefix: "/district" });
	});
};
