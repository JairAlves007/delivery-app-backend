import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { getAuthUser } from "@/helpers/utils";
import { FastifyReply, FastifyRequest } from "fastify";

export const ensureAuthenticated = async (
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
		if (error instanceof UserUnauthenticated) {
			return reply
				.status(HTTPStatusCodes.UNAUTHORIZED)
				.send(ApiResponse.error(error));
		}

		throw error;
	}
};
