import type { FastifyInstance } from "fastify";

import { createAddonCategoryRoute } from "./create-addon-category.route.js";
import { deleteAddonCategoryRoute } from "./delete-addon-category.route.js";
import { findAddonCategoryRoute } from "./find-addon-category.route.js";
import { listAddonCategoriesRoute } from "./list-addon-categories.route.js";
import { updateAddonCategoryRoute } from "./update-addon-category.route.js";

export const adminAddonCategoryRoutes = async (app: FastifyInstance) => {
  app.register(listAddonCategoriesRoute);
  app.register(findAddonCategoryRoute);
  app.register(createAddonCategoryRoute);
  app.register(updateAddonCategoryRoute);
  app.register(deleteAddonCategoryRoute);
};
