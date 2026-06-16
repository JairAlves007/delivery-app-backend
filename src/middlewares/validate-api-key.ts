import { timingSafeEqual } from "node:crypto";

import type { FastifyRequest } from "fastify";

import { env } from "@/env.js";
import { InvalidApiKey } from "@/errors/auth/invalid-api-key.js";
import Constants from "@/helpers/constants.js";

export const validateApiKey = async (request: FastifyRequest) => {
  if (request.method === "OPTIONS") return;

  const providedKey = request.headers[Constants.PUBLIC_API_KEY_HEADER];

  if (typeof providedKey !== "string" || providedKey.length === 0)
    throw new InvalidApiKey();

  const provided = Buffer.from(providedKey);
  const expected = Buffer.from(env.PUBLIC_API_KEY);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected))
    throw new InvalidApiKey();
};
