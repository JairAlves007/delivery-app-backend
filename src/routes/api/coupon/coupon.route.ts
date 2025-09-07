import { check } from "@/controllers/coupon.controller.ts";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import { RoleType } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const couponMiddlewares = {
	onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.CLIENT])]
};

export const couponRoutes = (app: FastifyInstance) => {
	app.post("/check", couponMiddlewares, check);
};
