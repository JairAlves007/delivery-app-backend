import type { FastifyInstance } from "fastify";

import { listHubEstablishmentsRoute } from "./list-establishments.route.js";
import { listHubFiltersRoute } from "./list-hub-filters.route.js";

export const hubRoutes = async (app: FastifyInstance) => {
  app.register(listHubFiltersRoute);
  app.register(listHubEstablishmentsRoute);
};
