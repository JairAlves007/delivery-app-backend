import type { FastifyInstance } from "fastify";

import { validateApiKey } from "@/middlewares/validate-api-key.js";

import { comboCatalogRoutes } from "./combo/index.js";
import { couponRoutes } from "./coupon/index.js";
import { districtCatalogRoutes } from "./district/index.js";
import { hubRoutes } from "./hub/index.js";
import { getDigitalMenuPdfRoute } from "./main/get-digital-menu-pdf.route.js";
import { mainRoutes } from "./main/index.js";
import { orderRoutes } from "./order/index.js";
import { promotionCatalogRoutes } from "./promotion/index.js";
import { whatsappWebhookRoutes } from "./whatsapp/index.js";

export const apiRoutes = (app: FastifyInstance) => {
	app.register(async api => {
		api.addHook("onRequest", validateApiKey);

		api.register(mainRoutes, { prefix: "/main" });
		api.register(hubRoutes, { prefix: "/hub" });
		api.register(couponRoutes, { prefix: "/coupon" });
		api.register(orderRoutes, { prefix: "/order" });
		api.register(districtCatalogRoutes, { prefix: "/district" });
		api.register(promotionCatalogRoutes, { prefix: "/promotion" });
		api.register(comboCatalogRoutes, { prefix: "/combo" });
	});

	app.register(getDigitalMenuPdfRoute, { prefix: "/main" });
	app.register(whatsappWebhookRoutes, { prefix: "/whatsapp" });
};
