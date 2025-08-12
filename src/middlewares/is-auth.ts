import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { FastifyRequest } from "fastify/types/request";

export const isAuthenticated = async (request: FastifyRequest) => {
	try {
		await request.jwtVerify();
	} catch {
		throw new UserUnauthenticated();
	}
};
