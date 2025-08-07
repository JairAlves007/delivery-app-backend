import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { RoleType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export const ensureHasRoles = async (
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
