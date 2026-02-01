import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.ts";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.ts";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import type { PermissionType } from "@/generated/prisma/client.ts";
import type { FastifyRequest } from "fastify";

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
