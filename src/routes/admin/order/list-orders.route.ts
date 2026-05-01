import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListOrderService } from "@/factories/services/order/make-list-order-service.js";
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
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { orderListResponseSchema } from "@/schemas/response-schema.js";

export const listOrdersRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listOrders",
        tags: adminTags("Orders"),
        summary: "Listar pedidos",
        querystring: listQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(orderListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.CANCEL_ORDERS]),
      ],
    },
    async (request, reply) => {
      const query = request.query;

      const listOrderService = makeListOrderService();

      const orders = await listOrderService.handle({
        ...query,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Pedidos listados com sucesso", orders));
    },
  );
};
