import {
	destroy,
	index,
	store,
	update
} from "@/controllers/banner.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const bannerMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_BANNERS])
	]
};

export const adminBannerRoutes = async (app: FastifyInstance) => {
	app.get("/", bannerMiddlewares, index);
	app.post("/", bannerMiddlewares, store);
	app.patch("/:id", bannerMiddlewares, update);
	app.delete("/:id", bannerMiddlewares, destroy);
};
