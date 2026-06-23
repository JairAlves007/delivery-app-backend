import type { FastifyInstance } from "fastify";

import { createComboRoute } from "./create-combo.route.js";
import { deleteComboRoute } from "./delete-combo.route.js";
import { findComboRoute } from "./find-combo.route.js";
import { listCombosRoute } from "./list-combos.route.js";
import { updateComboRoute } from "./update-combo.route.js";

export const adminComboRoutes = async (app: FastifyInstance) => {
  app.register(listCombosRoute);
  app.register(findComboRoute);
  app.register(createComboRoute);
  app.register(updateComboRoute);
  app.register(deleteComboRoute);
};
