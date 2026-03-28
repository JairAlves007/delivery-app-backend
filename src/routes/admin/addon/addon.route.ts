import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/addon.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const addonMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
	]
};

export const adminAddonRoutes = async (app: FastifyInstance) => {
	app.get("/", addonMiddlewares, index);
	app.get("/:id", addonMiddlewares, find);
	app.post("/", addonMiddlewares, store);
	app.patch("/:id", addonMiddlewares, update);
	app.delete("/:id", addonMiddlewares, destroy);
};
