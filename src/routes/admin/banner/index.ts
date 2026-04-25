import type { FastifyInstance } from "fastify";

import { createBannerRoute } from "./create-banner.route.js";
import { deleteBannerRoute } from "./delete-banner.route.js";
import { findBannerRoute } from "./find-banner.route.js";
import { listBannersRoute } from "./list-banners.route.js";
import { updateBannerRoute } from "./update-banner.route.js";

export const adminBannerRoutes = async (app: FastifyInstance) => {
  app.register(listBannersRoute);
  app.register(findBannerRoute);
  app.register(createBannerRoute);
  app.register(updateBannerRoute);
  app.register(deleteBannerRoute);
};
