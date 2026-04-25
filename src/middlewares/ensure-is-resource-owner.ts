import type { FastifyRequest } from "fastify";

import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.js";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.js";
import prisma from "@/lib/prisma.js";

type ResourceType = "address" | "order";

export const ensureIsResourceOwner = (resource: ResourceType) => {
  return async (request: FastifyRequest) => {
    const user = request.user;
    if (!user) throw new UserUnauthenticated();

    const { id } = request.params as { id?: string };
    if (!id) return;

    let isOwner = false;

    switch (resource) {
      case "address": {
        const userAddress = await prisma.userAddress.findFirst({
          where: { user_id: user.sub, address_id: id, deleted_at: null },
        });
        if (userAddress) isOwner = true;
        break;
      }
      case "order": {
        const order = await prisma.order.findFirst({
          where: { user_id: user.sub, id, deleted_at: null },
          select: { id: true },
        });
        if (order) isOwner = true;
        break;
      }
    }

    if (!isOwner) throw new UserUnauthorized();
  };
};
