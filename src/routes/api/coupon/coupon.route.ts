import { check } from "@/controllers/coupon.controller.ts";
import { RoleType } from "@/generated/prisma/client.ts";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

const couponMiddlewares = {
	onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.CUSTOMER])]
};

export const couponRoutes = (app: FastifyInstance) => {
	app.post("/check", couponMiddlewares, check);
};
