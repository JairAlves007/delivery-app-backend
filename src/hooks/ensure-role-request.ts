import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { makeRoleRepository } from "@/factories/repositories/make-role-repository";
import type { RoleType } from "@prisma/client";
import type { FastifyRequest } from "fastify";

export const ensureRoleRequest = async (
	request: FastifyRequest,
	role: RoleType
) => {
	try {
		const roleRepository = makeRoleRepository();
		const roleFound = await roleRepository.findByName(role);

		if (!roleFound) throw new UserUnauthorized();

		request.role = roleFound.name;
	} catch (error) {
		throw error;
	}
};
