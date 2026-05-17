import type { FastifyInstance } from "fastify";

import { listDistrictsCatalogRoute } from "./list-districts-catalog.route.js";

export const districtCatalogRoutes = async (app: FastifyInstance) => {
	app.register(listDistrictsCatalogRoute);
};
