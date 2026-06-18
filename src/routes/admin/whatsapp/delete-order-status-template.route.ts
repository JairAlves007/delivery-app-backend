import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteOrderStatusTemplateService } from "@/factories/services/whatsapp/make-delete-order-status-template-service.js";
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
} from "@/schemas/whatsapp-schema.js";

export const deleteOrderStatusTemplateRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/templates/:status",
    {
      schema: {
        operationId: "deleteOrderStatusTemplate",
        tags: adminTags("Whatsapp"),
        summary: "Remover o template de um status (volta ao padrão)",
        params: orderStatusTemplateParamsSchema,
        querystring: orderStatusTemplateQuerySchema,
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
      const establishmentId = getUserEstablishmentId(request.user);

      const deleteOrderStatusTemplateService =
        makeDeleteOrderStatusTemplateService();

      await deleteOrderStatusTemplateService.handle({
        establishmentId,
        status,
        isScheduled: scheduled,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Template removido com sucesso", {}));
    },
  );
};
