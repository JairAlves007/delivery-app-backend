import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { RolePrismaRepository } from "@/repositories/role-prisma-repository";
import { RoleType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export const ensureRoleRequest = async (
	request: FastifyRequest,
	reply: FastifyReply,
	role: RoleType
) => {
	try {
		const roleRepository = new RolePrismaRepository();
		const roleFound = await roleRepository.findByName(role);

		if (!roleFound) throw new UserUnauthorized();

		request.role = roleFound.name;
	} catch (error) {
		if (error instanceof UserUnauthorized) {
			return reply
				.status(HTTPStatusCodes.UNAUTHORIZED)
				.send(ApiResponse.error(error));
		}

		throw error;
	}
};
