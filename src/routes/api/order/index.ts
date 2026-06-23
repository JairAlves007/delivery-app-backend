import type { FastifyInstance } from "fastify";

import { createOrderRoute } from "./create-order.route.js";
import { quoteOrderRoute } from "./quote-order.route.js";

export const orderRoutes = async (app: FastifyInstance) => {
	app.register(createOrderRoute);
	app.register(quoteOrderRoute);
};
