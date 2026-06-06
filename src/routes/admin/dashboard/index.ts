import type { FastifyInstance } from "fastify";

import { exportDashboardRoute } from "./export-dashboard.route.js";
import { getDashboardRoute } from "./get-dashboard.route.js";

export const adminDashboardRoutes = async (app: FastifyInstance) => {
  app.register(getDashboardRoute);
  app.register(exportDashboardRoute);
};
