import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeGetEstablishmentWhatsappStatusService } from "@/factories/services/whatsapp/make-get-establishment-whatsapp-status-service.js";
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
import { whatsappStatusResponseSchema } from "@/schemas/whatsapp-schema.js";

export const getWhatsappStatusRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/status",
    {
      schema: {
        operationId: "getWhatsappStatus",
        tags: adminTags("Whatsapp"),
        summary: "Consultar o status de conexão do WhatsApp",
        response: {
          200: apiSuccessResponseSchema(whatsappStatusResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
          502: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_WHATSAPP]),
      ],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const getEstablishmentWhatsappStatusService =
        makeGetEstablishmentWhatsappStatusService();

      const result = await getEstablishmentWhatsappStatusService.handle({
        establishmentId,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Status obtido com sucesso", result));
    },
  );
};
