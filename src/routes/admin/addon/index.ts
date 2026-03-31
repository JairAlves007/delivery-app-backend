import type { FastifyInstance } from "fastify";

import { createAddonRoute } from "./create-addon.route.js";
import { deleteAddonRoute } from "./delete-addon.route.js";
import { findAddonRoute } from "./find-addon.route.js";
import { listAddonsRoute } from "./list-addons.route.js";
import { updateAddonRoute } from "./update-addon.route.js";

export const adminAddonRoutes = async (app: FastifyInstance) => {
	app.register(listAddonsRoute);
	app.register(findAddonRoute);
	app.register(createAddonRoute);
	app.register(updateAddonRoute);
	app.register(deleteAddonRoute);
};
