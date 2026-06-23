import type { FastifyInstance } from "fastify";

import { listActivePromotionsRoute } from "./list-active-promotions.route.js";

export const promotionCatalogRoutes = async (app: FastifyInstance) => {
  app.register(listActivePromotionsRoute);
};
