import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/addon.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

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
