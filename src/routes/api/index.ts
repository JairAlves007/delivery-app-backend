import type { FastifyInstance } from "fastify";

import { validateApiKey } from "@/middlewares/validate-api-key.js";

import { couponRoutes } from "./coupon/index.js";
import { districtCatalogRoutes } from "./district/index.js";
import { hubRoutes } from "./hub/index.js";
import { mainRoutes } from "./main/index.js";
import { orderRoutes } from "./order/index.js";
import { whatsappWebhookRoutes } from "./whatsapp/index.js";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.addHook("onRequest", validateApiKey);

		api.register(mainRoutes, { prefix: "/main" });
		api.register(hubRoutes, { prefix: "/hub" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(orderRoutes, { prefix: "/order" });
		api.register(districtCatalogRoutes, { prefix: "/district" });
	});

	app.register(whatsappWebhookRoutes, { prefix: "/whatsapp" });
};
