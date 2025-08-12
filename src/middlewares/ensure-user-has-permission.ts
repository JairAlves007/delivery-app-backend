import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { makeUserRepository } from "@/factories/repositories/make-user-repository";
import type { PermissionType } from "@prisma/client";
import { FastifyRequest } from "fastify/types/request";

export const ensureUserHasPermission = (permissions: PermissionType[]) => {
	return async (request: FastifyRequest) => {
		try {
			const user = request.user;

			if (!user) throw new UserUnauthenticated();

			const userRepository = makeUserRepository();
			const userPermissions = await userRepository.getPermissions(user.sub);

			if (
				!permissions.every(permission => userPermissions.includes(permission))
			)
				throw new UserUnauthorized();
		} catch (error) {
			throw error;
		}
	};
};
