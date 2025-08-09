import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import type { RoleType } from "@prisma/client";
import type { FastifyRequest } from "fastify";

export const ensureUserHasRoles = async (
	request: FastifyRequest,
	roles: RoleType[]
) => {
	try {
		const user = request.user;

		if (!user) throw new UserUnauthenticated();

		if (!roles.includes(user.roleType)) throw new UserUnauthorized();
	} catch (error) {
		throw error;
	}
};
