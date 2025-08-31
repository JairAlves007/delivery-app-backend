import type { FastifyInstance } from "fastify";
import { adminAuthRoutes } from "./auth/auth.route.ts";
import { establishmentRoutes } from "./establishment/establishment.route.ts";
import { adminProductRoutes } from "./product/product.route.ts";
import { adminProductCategoryRoutes } from "./product/category/category.route.ts";
import { adminDistrictRoutes } from "./district/district.route.ts";
import { adminBannerRoutes } from "./banner/banner.route.ts";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
			api.register(establishmentRoutes, { prefix: "/establishment" });
			api.register(adminProductRoutes, { prefix: "/products" });
			api.register(adminProductCategoryRoutes, { prefix: "/product/category" });
			api.register(adminDistrictRoutes, { prefix: "/district" });
			api.register(adminBannerRoutes, { prefix: "/banner" });
		},
		{ prefix: "/admin" }
	);
};
