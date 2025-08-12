import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import type { RoleType } from "@prisma/client";
import { FastifyRequest } from "fastify/types/request";

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
