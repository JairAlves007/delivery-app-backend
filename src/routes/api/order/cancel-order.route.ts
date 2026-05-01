import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCancelOrderFromCustomerService } from "@/factories/services/order/make-cancel-order-from-customer-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";
import { orderParamsSchema } from "@/schemas/order-schema.js";

export const cancelOrderRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/cancel/:id",
    {
      schema: {
        operationId: "cancelOrder",
        tags: customerTags("Orders"),
        summary: "Cancelar pedido do cliente",
        params: orderParamsSchema,
        response: {
          204: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_OWN_ORDERS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;
      const establishmentId = getUserEstablishmentId(request.user);
      const userId = userIdSchema.parse(request.user.sub);

      const cancelOrderService = makeCancelOrderFromCustomerService();

      await cancelOrderService.handle({
        id,
        filterParams: { establishment_id: establishmentId, user_id: userId },
      });

      return reply
        .status(HTTPStatusCodes.NO_CONTENT)
        .send(ApiResponse.success("Pedido cancelado com sucesso", {}));
    },
  );
};
