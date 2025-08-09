import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { makeUserRepository } from "@/factories/repositories/make-user-repository";
import type { PermissionType } from "@prisma/client";
import type { FastifyRequest } from "fastify";

export const ensureUserHasPermission = async (
	request: FastifyRequest,
	permission: PermissionType
) => {
	try {
		const user = request.user;

		if (!user) throw new UserUnauthenticated();

		const userRepository = makeUserRepository();
		const userPermissions = await userRepository.getPermissions(user.id);

		if (!userPermissions.includes(permission)) throw new UserUnauthorized();
	} catch (error) {
		throw error;
	}
};
