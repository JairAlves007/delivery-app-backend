import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListOrderStatusTemplatesService } from "@/factories/services/whatsapp/make-list-order-status-templates-service.js";
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
import { listOrderStatusTemplatesResponseSchema } from "@/schemas/whatsapp-schema.js";

export const listOrderStatusTemplatesRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/templates",
    {
      schema: {
        operationId: "listOrderStatusTemplates",
        tags: adminTags("Whatsapp"),
        summary: "Listar templates de mensagem por status do pedido",
        response: {
          200: apiSuccessResponseSchema(listOrderStatusTemplatesResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_WHATSAPP]),
      ],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const listOrderStatusTemplatesService =
        makeListOrderStatusTemplatesService();

      const result = await listOrderStatusTemplatesService.handle({
        establishmentId,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Templates listados com sucesso", result));
    },
  );
};
