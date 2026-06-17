import type { FastifyInstance } from "fastify";

import { establishmentContextRoute } from "./establishment-context.route.js";
import { findProductCatalogRoute } from "./find-product-catalog.route.js";
import { getDigitalMenuPdfRoute } from "./get-digital-menu-pdf.route.js";
import { listBannersCatalogRoute } from "./list-banners-catalog.route.js";
import { listProductCategoriesCatalogRoute } from "./list-product-categories-catalog.route.js";
import { listProductsBatchCatalogRoute } from "./list-products-batch-catalog.route.js";
import { listProductsFromCategoryCatalogRoute } from "./list-products-from-category-catalog.route.js";
import { listSuggestedProductsCatalogRoute } from "./list-suggested-products-catalog.route.js";
import { searchProductsCatalogRoute } from "./search-products-catalog.route.js";

export const mainRoutes = async (app: FastifyInstance) => {
  app.register(establishmentContextRoute);
  app.register(getDigitalMenuPdfRoute);
  app.register(
    async (api) => {
      api.register(listBannersCatalogRoute);
      api.register(listProductCategoriesCatalogRoute);
      api.register(listProductsFromCategoryCatalogRoute);
      api.register(listProductsBatchCatalogRoute);
      api.register(listSuggestedProductsCatalogRoute);
      api.register(searchProductsCatalogRoute);
      api.register(findProductCatalogRoute);
    },
    { prefix: "/home" },
  );
};
