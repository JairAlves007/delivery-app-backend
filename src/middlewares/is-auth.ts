import type { FastifyRequest } from "fastify";

import { UserUnauthenticated } from "@/errors/user/user-unauthenticated.js";

export const isAuthenticated = async (request: FastifyRequest) => {
  try {
    await request.jwtVerify();
  } catch {
    throw new UserUnauthenticated();
  }
};
