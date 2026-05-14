import type { FastifyInstance } from "fastify";

import { meRoute } from "./me.route.js";
import { signInRoute } from "./sign-in.route.js";

export const adminAuthRoutes = async (app: FastifyInstance) => {
  app.register(signInRoute);
  app.register(meRoute);
};
