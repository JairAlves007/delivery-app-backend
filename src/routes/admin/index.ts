import type { FastifyInstance } from "fastify";

import { adminAddonCategoryRoutes } from "./addon/category/index.js";
import { adminAddonRoutes } from "./addon/index.js";
import { adminAuthRoutes } from "./auth/index.js";
import { adminBannerRoutes } from "./banner/index.js";
import { adminCouponRoutes } from "./coupon/index.js";
import { adminDashboardRoutes } from "./dashboard/index.js";
import { adminDigitalMenuRoutes } from "./digital-menu/index.js";
import { adminDistrictRoutes } from "./district/index.js";
import { establishmentRoutes } from "./establishment/index.js";
import { establishmentOwnerRoutes } from "./establishment-owner/index.js";
import { adminOrderRoutes } from "./order/index.js";
import { adminProductCategoryRoutes } from "./product/category/index.js";
import { adminProductRoutes } from "./product/index.js";
import { adminTagRoutes } from "./tag/index.js";
import { uploadRoutes } from "./upload/index.js";
import { adminWhatsappRoutes } from "./whatsapp/index.js";

export const adminRoutes = (app: FastifyInstance) => {
  app.register(
    async (api) => {
      api.register(adminAuthRoutes, { prefix: "/auth" });
      api.register(uploadRoutes, { prefix: "/upload" });
      api.register(establishmentRoutes, { prefix: "/establishment" });
      api.register(establishmentOwnerRoutes, { prefix: "/establishment-owner" });
      api.register(adminProductRoutes, { prefix: "/products" });
      api.register(adminProductCategoryRoutes, { prefix: "/product/category" });
      api.register(adminDistrictRoutes, { prefix: "/district" });
      api.register(adminBannerRoutes, { prefix: "/banner" });
      api.register(adminAddonCategoryRoutes, { prefix: "/addon/category" });
      api.register(adminAddonRoutes, { prefix: "/addon" });
      api.register(adminCouponRoutes, { prefix: "/coupon" });
      api.register(adminOrderRoutes, { prefix: "/order" });
      api.register(adminDashboardRoutes, { prefix: "/dashboard" });
      api.register(adminTagRoutes, { prefix: "/tag" });
      api.register(adminWhatsappRoutes, { prefix: "/whatsapp" });
      api.register(adminDigitalMenuRoutes, { prefix: "/digital-menu" });
    },
    { prefix: "/admin" },
  );
};
