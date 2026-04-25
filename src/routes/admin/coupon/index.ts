import type { FastifyInstance } from "fastify";

import { createCouponRoute } from "./create-coupon.route.js";
import { deleteCouponRoute } from "./delete-coupon.route.js";
import { findCouponRoute } from "./find-coupon.route.js";
import { listCouponsRoute } from "./list-coupons.route.js";
import { updateCouponRoute } from "./update-coupon.route.js";

export const adminCouponRoutes = async (app: FastifyInstance) => {
  app.register(listCouponsRoute);
  app.register(findCouponRoute);
  app.register(createCouponRoute);
  app.register(updateCouponRoute);
  app.register(deleteCouponRoute);
};
