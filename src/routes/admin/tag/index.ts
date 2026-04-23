import type { FastifyInstance } from "fastify";

import { listTagsRoute } from "./list-tags.route.js";

export const adminTagRoutes = async (app: FastifyInstance) => {
	app.register(listTagsRoute);
};
