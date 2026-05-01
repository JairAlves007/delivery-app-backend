import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeRefreshTokenService } from "@/factories/services/auth/make-refresh-token-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sharedTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { refreshTokenBodySchema } from "@/schemas/auth-schema.js";

export const logoutRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/logout",
    {
      schema: {
        operationId: "logout",
        tags: sharedTags("Auth"),
        summary: "Invalidar refresh token (logout)",
        body: refreshTokenBodySchema,
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body;
      const { refreshToken } = body;

      const refreshTokenService = makeRefreshTokenService();

      await refreshTokenService.revoke(refreshToken);

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Logout realizado com sucesso", {}),
      );
    },
  );
};