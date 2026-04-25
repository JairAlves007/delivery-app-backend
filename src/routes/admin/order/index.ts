import type { FastifyInstance } from "fastify";

import { findOrderRoute } from "./find-order.route.js";
import { listOrdersRoute } from "./list-orders.route.js";
import { updateOrderRoute } from "./update-order.route.js";

export const adminOrderRoutes = async (app: FastifyInstance) => {
  app.register(listOrdersRoute);
  app.register(findOrderRoute);
  app.register(updateOrderRoute);
};
