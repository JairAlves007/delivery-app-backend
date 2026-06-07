import type { FastifyInstance } from "fastify";

import { connectWhatsappRoute } from "./connect-whatsapp.route.js";
import { deleteOrderStatusTemplateRoute } from "./delete-order-status-template.route.js";
import { disconnectWhatsappRoute } from "./disconnect-whatsapp.route.js";
import { getWhatsappStatusRoute } from "./get-whatsapp-status.route.js";
import { listOrderStatusTemplatesRoute } from "./list-order-status-templates.route.js";
import { upsertOrderStatusTemplateRoute } from "./upsert-order-status-template.route.js";

export const adminWhatsappRoutes = async (app: FastifyInstance) => {
  app.register(connectWhatsappRoute);
  app.register(disconnectWhatsappRoute);
  app.register(getWhatsappStatusRoute);
  app.register(listOrderStatusTemplatesRoute);
  app.register(upsertOrderStatusTemplateRoute);
  app.register(deleteOrderStatusTemplateRoute);
};
