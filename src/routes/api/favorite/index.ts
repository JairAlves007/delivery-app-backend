import type { FastifyInstance } from "fastify";

import { addFavoriteRoute } from "./add-favorite.route.js";
import { listMyFavoritesRoute } from "./list-my-favorites.route.js";
import { removeFavoriteRoute } from "./remove-favorite.route.js";

export const favoriteRoutes = async (app: FastifyInstance) => {
  app.register(listMyFavoritesRoute);
  app.register(addFavoriteRoute);
  app.register(removeFavoriteRoute);
};
