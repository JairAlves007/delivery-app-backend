import type { FastifyInstance } from "fastify";

import { getDashboardRoute } from "./get-dashboard.route.js";

export const adminDashboardRoutes = async (app: FastifyInstance) => {
	app.register(getDashboardRoute);
};
