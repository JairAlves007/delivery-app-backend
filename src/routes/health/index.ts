import type { FastifyInstance } from "fastify";

import { pingRoute } from "./ping.route.js";
import { readyRoute } from "./ready.route.js";

export const healthRoutes = async (app: FastifyInstance) => {
  app.register(pingRoute);
  app.register(readyRoute);
};
