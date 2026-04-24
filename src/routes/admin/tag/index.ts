import type { FastifyInstance } from "fastify";

import { createTagRoute } from "./create-tag.route.js";
import { deleteTagRoute } from "./delete-tag.route.js";
import { findTagRoute } from "./find-tag.route.js";
import { listTagsRoute } from "./list-tags.route.js";
import { updateTagRoute } from "./update-tag.route.js";

export const adminTagRoutes = async (app: FastifyInstance) => {
	app.register(listTagsRoute);
	app.register(findTagRoute);
	app.register(createTagRoute);
	app.register(updateTagRoute);
	app.register(deleteTagRoute);
};
