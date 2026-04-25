import type { FastifyInstance } from "fastify";

import { createDistrictRoute } from "./create-district.route.js";
import { deleteDistrictRoute } from "./delete-district.route.js";
import { findDistrictRoute } from "./find-district.route.js";
import { listDistrictsRoute } from "./list-districts.route.js";
import { updateDistrictRoute } from "./update-district.route.js";

export const adminDistrictRoutes = async (app: FastifyInstance) => {
  app.register(listDistrictsRoute);
  app.register(findDistrictRoute);
  app.register(createDistrictRoute);
  app.register(updateDistrictRoute);
  app.register(deleteDistrictRoute);
};
