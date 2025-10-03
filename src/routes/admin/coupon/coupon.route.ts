import {
	destroy,
	find,
	index,
	store,
	update
} from "@/controllers/coupon.controller.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { PermissionType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

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
