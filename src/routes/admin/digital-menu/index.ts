import type { FastifyInstance } from "fastify";

import { generateDigitalMenuRoute } from "./generate-digital-menu.route.js";
import { uploadDigitalMenuRoute } from "./upload-digital-menu.route.js";

export const adminDigitalMenuRoutes = async (app: FastifyInstance) => {
  app.register(generateDigitalMenuRoute);
  app.register(uploadDigitalMenuRoute);
};
