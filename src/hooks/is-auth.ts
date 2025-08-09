import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { getAuthUser } from "@/helpers/utils";
import { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		const authorization = request.headers.authorization;

		if (!authorization) throw new UserUnauthenticated();

		const user = getAuthUser(authorization);

		if (!user) throw new UserUnauthenticated();

		request.user = user;
	} catch (error) {
		return reply.sendError(error);
	}
};
