import type { FastifyInstance } from "fastify";

import { addressRoutes } from "./address/index.js";
import { authRoutes } from "./auth/index.js";
import { couponRoutes } from "./coupon/index.js";
import { mainRoutes } from "./main/index.js";
import { orderRoutes } from "./order/index.js";

export const apiRoutes = (app: FastifyInstance) => {
  app.register(async (api) => {
    api.register(authRoutes, { prefix: "/auth" });
    api.register(mainRoutes, { prefix: "/main" });
    api.register(couponRoutes, { prefix: "/coupon" });
    api.register(addressRoutes, { prefix: "/address" });
    api.register(orderRoutes, { prefix: "/order" });
  });
};
