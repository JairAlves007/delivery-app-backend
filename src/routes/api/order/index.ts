import type { FastifyInstance } from "fastify";

import { createOrderRoute } from "./create-order.route.js";

export const orderRoutes = async (app: FastifyInstance) => {
	app.register(createOrderRoute);
};
