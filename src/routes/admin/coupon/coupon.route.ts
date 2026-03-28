import type { FastifyInstance } from "fastify";

import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/coupon.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const couponMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([PermissionType.MANAGE_COUPONS])
	]
};

export const adminCouponRoutes = async (app: FastifyInstance) => {
	app.get("/", couponMiddlewares, index);
	app.get("/:id", couponMiddlewares, find);
	app.post("/", couponMiddlewares, store);
	app.patch("/:id", couponMiddlewares, update);
	app.delete("/:id", couponMiddlewares, destroy);
};
