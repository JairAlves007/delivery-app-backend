import type { FastifyInstance } from "fastify";

import { cancelOrderRoute } from "./cancel-order.route.js";
import { createOrderRoute } from "./create-order.route.js";
import { findOrderRoute } from "./find-order.route.js";
import { myOrdersRoute } from "./my-orders.route.js";

export const orderRoutes = async (app: FastifyInstance) => {
  app.register(myOrdersRoute);
  app.register(findOrderRoute);
  app.register(createOrderRoute);
  app.register(cancelOrderRoute);
};
