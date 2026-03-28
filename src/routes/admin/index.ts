import type { FastifyInstance } from "fastify";

import { adminAddonRoutes } from "./addon/addon.route.js";
import { adminAddonCategoryRoutes } from "./addon/category/addon-category.route.js";
import { adminAuthRoutes } from "./auth/auth.route.js";
import { adminBannerRoutes } from "./banner/banner.route.js";
import { adminCouponRoutes } from "./coupon/coupon.route.js";
import { adminDistrictRoutes } from "./district/district.route.js";
import { establishmentRoutes } from "./establishment/establishment.route.js";
import { adminOrderRoutes } from "./order/order.route.js";
import { adminProductCategoryRoutes } from "./product/category/category.route.js";
import { adminProductRoutes } from "./product/product.route.js";
import { uploadRoutes } from "./upload/upload.route.js";

export const adminRoutes = (app: FastifyInstance) => {
	app.register(
		async api => {
			api.register(adminAuthRoutes, { prefix: "/auth" });
			api.register(uploadRoutes, { prefix: "/upload" });
			api.register(establishmentRoutes, { prefix: "/establishment" });
			api.register(adminProductRoutes, { prefix: "/products" });
			api.register(adminProductCategoryRoutes, { prefix: "/product/category" });
			api.register(adminDistrictRoutes, { prefix: "/district" });
			api.register(adminBannerRoutes, { prefix: "/banner" });
			api.register(adminAddonCategoryRoutes, { prefix: "/addon/category" });
			api.register(adminAddonRoutes, { prefix: "/addon" });
			api.register(adminCouponRoutes, { prefix: "/coupon" });
			api.register(adminOrderRoutes, { prefix: "/order" });
		},
		{ prefix: "/admin" }
	);
};
