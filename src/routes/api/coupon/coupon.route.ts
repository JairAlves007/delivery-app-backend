import type { FastifyInstance } from "fastify";

import { check } from "@/controllers/coupon.controller.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

const couponMiddlewares = {
	onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.CUSTOMER])]
};

export const couponRoutes = (app: FastifyInstance) => {
	app.post("/check", couponMiddlewares, check);
};
