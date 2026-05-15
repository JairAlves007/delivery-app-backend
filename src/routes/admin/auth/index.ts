import type { FastifyInstance } from "fastify";

import { logoutRoute } from "./logout.route.js";
import { meRoute } from "./me.route.js";
import { refreshTokenRoute } from "./refresh-token.route.js";
import { signInRoute } from "./sign-in.route.js";

export const adminAuthRoutes = async (app: FastifyInstance) => {
  app.register(signInRoute);
  app.register(meRoute);
  app.register(logoutRoute);
  app.register(refreshTokenRoute);
};
