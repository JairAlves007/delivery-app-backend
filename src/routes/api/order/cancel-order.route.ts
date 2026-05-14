import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCancelOrderFromCustomerService } from "@/factories/services/order/make-cancel-order-from-customer-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
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
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const cancelOrderService = makeCancelOrderFromCustomerService();

      await cancelOrderService.handle({
        id,
        filterParams: {},
      });

      return reply
        .status(HTTPStatusCodes.NO_CONTENT)
        .send(ApiResponse.success("Pedido cancelado com sucesso", {}));
    },
  );
};
