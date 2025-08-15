import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.ts";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.ts";
import type { RoleType } from "@prisma/client";
import type { FastifyRequest } from "fastify";

export const ensureUserHasRoles = (roles: RoleType[]) => {
	return async (request: FastifyRequest) => {
		try {
			const user = request.user;

			if (!user) throw new UserUnauthenticated();

			if (!roles.includes(user.role)) throw new UserUnauthorized();
		} catch (error) {
			throw error;
		}
	};
};
