import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeValidateResetPasswordTokenService } from "@/factories/services/auth/make-validate-reset-password-token-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { validateResetPasswordTokenQuerySchema } from "@/schemas/auth-schema.js";

const responseSchema = z.object({ valid: z.boolean() });

export const validateResetPasswordTokenRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/reset-password/validate",
    {
      schema: {
        operationId: "validateResetPasswordToken",
        tags: customerTags("Auth"),
        summary: "Validar token de redefinição de senha",
        querystring: validateResetPasswordTokenQuerySchema,
        response: {
          200: apiSuccessResponseSchema(responseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { token } = request.query;

      const service = makeValidateResetPasswordTokenService();
      const result = await service.handle(token);

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Validação concluída", result));
    },
  );
};
