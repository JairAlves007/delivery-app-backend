import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeGetDigitalMenuStatusService } from "@/factories/services/digital-menu/make-get-digital-menu-status-service.js";
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
} from "@/schemas/api-schema.js";
import { digitalMenuStatusResponseSchema } from "@/schemas/response-schema.js";

export const getDigitalMenuStatusRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/status",
    {
      schema: {
        operationId: "getDigitalMenuStatus",
        tags: adminTags("Cardápio Digital"),
        summary: "Consultar o status da geração do cardápio digital",
        response: {
          200: apiSuccessResponseSchema(digitalMenuStatusResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_DIGITAL_MENU]),
      ],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const getDigitalMenuStatusService = makeGetDigitalMenuStatusService();

      const result = await getDigitalMenuStatusService.handle({
        establishmentId,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Status obtido com sucesso", result));
    },
  );
};
