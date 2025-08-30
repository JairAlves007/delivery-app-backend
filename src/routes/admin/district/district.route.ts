import {
	destroy,
	index,
	store,
	update
} from "@/controllers/district.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const districtMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS])
	]
};

export const adminDistrictRoutes = async (app: FastifyInstance) => {
	app.get("/", districtMiddlewares, index);
	app.post("/", districtMiddlewares, store);
	app.patch("/:id", districtMiddlewares, update);
	app.delete("/:id", districtMiddlewares, destroy);
};
