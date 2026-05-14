import type { FastifyInstance } from "fastify";

import { establishmentContextRoute } from "./establishment-context.route.js";
import { listBannersCatalogRoute } from "./list-banners-catalog.route.js";
import { listProductCategoriesCatalogRoute } from "./list-product-categories-catalog.route.js";
import { listProductsFromCategoryCatalogRoute } from "./list-products-from-category-catalog.route.js";
import { listSuggestedProductsCatalogRoute } from "./list-suggested-products-catalog.route.js";

export const mainRoutes = async (app: FastifyInstance) => {
  app.register(establishmentContextRoute);
  app.register(
    async (api) => {
      api.register(listBannersCatalogRoute);
      api.register(listProductCategoriesCatalogRoute);
      api.register(listProductsFromCategoryCatalogRoute);
      api.register(listSuggestedProductsCatalogRoute);
    },
    { prefix: "/home" },
  );
};
