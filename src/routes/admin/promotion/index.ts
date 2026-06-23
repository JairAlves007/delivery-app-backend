import type { FastifyInstance } from "fastify";

import { createPromotionRoute } from "./create-promotion.route.js";
import { deletePromotionRoute } from "./delete-promotion.route.js";
import { findPromotionRoute } from "./find-promotion.route.js";
import { listPromotionsRoute } from "./list-promotions.route.js";
import { updatePromotionRoute } from "./update-promotion.route.js";

export const adminPromotionRoutes = async (app: FastifyInstance) => {
  app.register(listPromotionsRoute);
  app.register(findPromotionRoute);
  app.register(createPromotionRoute);
  app.register(updatePromotionRoute);
  app.register(deletePromotionRoute);
};
