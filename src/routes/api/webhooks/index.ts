import type { FastifyInstance } from "fastify";

import { whatsAppWebhookRoute } from "./whatsapp-webhook.route.js";

export const webhookRoutes = async (app: FastifyInstance) => {
	app.register(whatsAppWebhookRoute);
};
