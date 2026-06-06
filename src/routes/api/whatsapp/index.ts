import type { FastifyInstance } from "fastify";

import { whatsappWebhookRoute } from "./webhook.route.js";

export const whatsappWebhookRoutes = async (app: FastifyInstance) => {
  app.register(whatsappWebhookRoute);
};
