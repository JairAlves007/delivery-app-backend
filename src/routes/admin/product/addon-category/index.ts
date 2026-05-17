import type { FastifyInstance } from "fastify";

import { attachProductAddonCategoryRoute } from "./attach-product-addon-category.route.js";
import { detachProductAddonCategoryRoute } from "./detach-product-addon-category.route.js";
import { listProductAddonCategoriesRoute } from "./list-product-addon-categories.route.js";
import { updateProductAddonCategoryRoute } from "./update-product-addon-category.route.js";

export const adminProductAddonCategoryRoutes = async (app: FastifyInstance) => {
  app.register(listProductAddonCategoriesRoute);
  app.register(attachProductAddonCategoryRoute);
  app.register(updateProductAddonCategoryRoute);
  app.register(detachProductAddonCategoryRoute);
};
