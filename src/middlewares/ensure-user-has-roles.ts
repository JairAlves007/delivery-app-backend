import type { FastifyRequest } from "fastify";

import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.js";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.js";
import type { RoleType } from "@/generated/prisma/client.js";

export const ensureUserHasRoles = (roles: RoleType[]) => {
  return async (request: FastifyRequest) => {
    const user = request.user;

    if (!user) throw new UserUnauthenticated();

    if (!roles.includes(user.role)) throw new UserUnauthorized();
  };
};
