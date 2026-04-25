import type { FastifyRequest } from "fastify";

import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.js";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import type { PermissionType } from "@/generated/prisma/client.js";

export const ensureUserHasPermission = (permissions: PermissionType[]) => {
  return async (request: FastifyRequest) => {
    const user = request.user;

    if (!user) throw new UserUnauthenticated();

    const userRepository = makeUserRepository();
    const userPermissions = await userRepository.getPermissions(user.sub);

    if (
      !permissions.every((permission) => userPermissions.includes(permission))
    )
      throw new UserUnauthorized();
  };
};
