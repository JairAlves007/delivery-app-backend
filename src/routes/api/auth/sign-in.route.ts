import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeSignInService } from "@/factories/services/auth/make-sign-in-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { signInBodySchema } from "@/schemas/auth-schema.js";
import { signInCustomerResponseSchema } from "@/schemas/response-schema.js";

export const signInRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-in",
    {
      schema: {
        operationId: "signIn",
        tags: ["Auth"],
        summary: "Autenticar usuário",
        body: signInBodySchema,
        response: {
          200: apiSuccessResponseSchema(signInCustomerResponseSchema),
          401: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      const signInService = makeSignInService();

      const { user, establishmentId } = await signInService.handle({
        ...body,
        allowedRoles: [RoleType.CUSTOMER],
      });

      const token = await reply.jwtSign(
        {
          role: user.role.name,
          activeTenantId: establishmentId,
          primaryTenantId: user.establishment?.id ?? null,
        },
        {
          sub: user.id,
          expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME,
        },
      );

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Usuário autenticado com sucesso", {
          type: Constants.TOKEN_TYPE,
          expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
          token,
        }),
      );
    },
  );
};
