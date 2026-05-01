import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentParamsSchema } from "@/schemas/establishment-schema.js";
import { establishmentResponseSchema } from "@/schemas/response-schema.js";

export const findEstablishmentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findEstablishment",
        tags: adminTags("Establishments"),
        summary: "Encontrar estabelecimento pelo ID",
        params: establishmentParamsSchema,
        response: {
          200: apiSuccessResponseSchema(establishmentResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;

      const findEstablishmentService = makeFindEstablishmentByIdService();

      const establishment = await findEstablishmentService.handle({ id });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Estabelecimento encontrado com sucesso",
            establishment,
          ),
        );
    },
  );
};
