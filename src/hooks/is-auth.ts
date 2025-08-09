import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { getAuthUser } from "@/helpers/utils";
import type { FastifyRequest } from "fastify";

export const isAuthenticated = async (request: FastifyRequest) => {
	try {
		const authorization = request.headers.authorization;

		if (!authorization) throw new UserUnauthenticated();

		const user = getAuthUser(authorization);

		if (!user) throw new UserUnauthenticated();

		request.user = user;
	} catch (error) {
		throw error;
	}
};
