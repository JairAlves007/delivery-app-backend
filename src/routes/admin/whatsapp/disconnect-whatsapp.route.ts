import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDisconnectEstablishmentWhatsappService } from "@/factories/services/whatsapp/make-disconnect-establishment-whatsapp-service.js";
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

export const disconnectWhatsappRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/disconnect",
    {
      schema: {
        operationId: "disconnectWhatsapp",
        tags: adminTags("Whatsapp"),
        summary: "Desconectar o WhatsApp do estabelecimento",
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
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

      const disconnectEstablishmentWhatsappService =
        makeDisconnectEstablishmentWhatsappService();

      await disconnectEstablishmentWhatsappService.handle({ establishmentId });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("WhatsApp desconectado com sucesso", {}));
    },
  );
};
