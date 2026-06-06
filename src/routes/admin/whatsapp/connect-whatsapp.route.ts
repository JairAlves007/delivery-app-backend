import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeConnectEstablishmentWhatsappService } from "@/factories/services/whatsapp/make-connect-establishment-whatsapp-service.js";
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
import { connectWhatsappResponseSchema } from "@/schemas/whatsapp-schema.js";

export const connectWhatsappRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/connect",
    {
      schema: {
        operationId: "connectWhatsapp",
        tags: adminTags("Whatsapp"),
        summary: "Conectar o WhatsApp do estabelecimento (gera QR Code)",
        response: {
          200: apiSuccessResponseSchema(connectWhatsappResponseSchema),
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

      const connectEstablishmentWhatsappService =
        makeConnectEstablishmentWhatsappService();

      const result = await connectEstablishmentWhatsappService.handle({
        establishmentId,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success("QR Code gerado com sucesso", {
            status: result.status,
            qrCodeBase64: result.qrCodeBase64,
            pairingCode: result.pairingCode,
          }),
        );
    },
  );
};
