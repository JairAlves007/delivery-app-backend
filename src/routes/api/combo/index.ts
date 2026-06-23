import type { FastifyInstance } from "fastify";

import { listActiveCombosRoute } from "./list-active-combos.route.js";

export const comboCatalogRoutes = async (app: FastifyInstance) => {
  app.register(listActiveCombosRoute);
};
