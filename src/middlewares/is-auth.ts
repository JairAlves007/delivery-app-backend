import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import type { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = async (request: FastifyRequest) => {
	try {
		await request.jwtVerify();
	} catch {
		throw new UserUnauthenticated();
	}
};
