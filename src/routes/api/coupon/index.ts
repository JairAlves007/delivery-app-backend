import type { FastifyInstance } from "fastify";

import { checkCouponRoute } from "./check-coupon.route.js";

export const couponRoutes = async (app: FastifyInstance) => {
  app.register(checkCouponRoute);
};
