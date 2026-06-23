import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindComboService } from "@/factories/services/combo/make-find-combo-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { comboParamsSchema } from "@/schemas/combo-schema.js";
import { comboResponseSchema } from "@/schemas/response-schema.js";

export const findComboRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findCombo",
        tags: adminTags("Combos"),
        summary: "Encontrar um combo",
        params: comboParamsSchema,
        response: {
          200: apiSuccessResponseSchema(comboResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_COMBOS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;

      const findComboService = makeFindComboService();

      const combo = await findComboService.handle({
        id,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Combo encontrado com sucesso", combo));
    },
  );
};
