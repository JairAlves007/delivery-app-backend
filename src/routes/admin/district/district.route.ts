import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/district.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

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
