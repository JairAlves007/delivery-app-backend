import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpsertOrderStatusTemplateService } from "@/factories/services/whatsapp/make-upsert-order-status-template-service.js";
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
import {
  orderStatusTemplateParamsSchema,
  orderStatusTemplateQuerySchema,
  upsertOrderStatusTemplateBodySchema,
} from "@/schemas/whatsapp-schema.js";

export const upsertOrderStatusTemplateRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/templates/:status",
    {
      schema: {
        operationId: "upsertOrderStatusTemplate",
        tags: adminTags("Whatsapp"),
        summary: "Criar ou atualizar o template de um status do pedido",
        params: orderStatusTemplateParamsSchema,
        querystring: orderStatusTemplateQuerySchema,
        body: upsertOrderStatusTemplateBodySchema,
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_WHATSAPP]),
      ],
    },
    async (request, reply) => {
      const { status } = request.params;
      const { scheduled } = request.query;
      const { body, isActive } = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const upsertOrderStatusTemplateService =
        makeUpsertOrderStatusTemplateService();

      await upsertOrderStatusTemplateService.handle({
        establishmentId,
        status,
        isScheduled: scheduled,
        body,
        isActive,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Template salvo com sucesso", {}));
    },
  );
};
