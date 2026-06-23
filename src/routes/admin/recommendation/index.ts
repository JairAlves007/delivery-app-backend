import type { FastifyInstance } from "fastify";

import { createRecommendationRoute } from "./create-recommendation.route.js";
import { deleteRecommendationRoute } from "./delete-recommendation.route.js";
import { listRecommendationsRoute } from "./list-recommendations.route.js";

export const adminRecommendationRoutes = async (app: FastifyInstance) => {
  app.register(listRecommendationsRoute);
  app.register(createRecommendationRoute);
  app.register(deleteRecommendationRoute);
};
