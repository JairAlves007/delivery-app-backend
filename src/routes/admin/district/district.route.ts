import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/district.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const districtMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS])
	]
};

export const adminDistrictRoutes = async (app: FastifyInstance) => {
	app.get("/", districtMiddlewares, index);
	app.get("/:id", districtMiddlewares, find);
	app.post("/", districtMiddlewares, store);
	app.patch("/:id", districtMiddlewares, update);
	app.delete("/:id", districtMiddlewares, destroy);
};
