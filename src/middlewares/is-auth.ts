import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.ts";
import type { FastifyRequest } from "fastify";

export const isAuthenticated = async (request: FastifyRequest) => {
	try {
		await request.jwtVerify();
	} catch {
		throw new UserUnauthenticated();
	}
};
