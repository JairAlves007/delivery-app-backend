import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { RoleType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export const ensureUserHasRoles = async (
	request: FastifyRequest,
	reply: FastifyReply,
	roles: RoleType[]
) => {
	try {
		const user = request.user;

		if (!user) throw new UserUnauthenticated();

		if (!roles.includes(user.roleType)) throw new UserUnauthorized();

		request.role = user.roleType;
	} catch (error) {
		return reply.sendError(error);
	}
};
