import type { FastifyInstance } from "fastify";

import { createTagCombinationRoute } from "./create-tag-combination.route.js";
import { deleteTagCombinationRoute } from "./delete-tag-combination.route.js";
import { listTagCombinationsRoute } from "./list-tag-combinations.route.js";

export const adminTagCombinationRoutes = async (app: FastifyInstance) => {
  app.register(listTagCombinationsRoute);
  app.register(createTagCombinationRoute);
  app.register(deleteTagCombinationRoute);
};
