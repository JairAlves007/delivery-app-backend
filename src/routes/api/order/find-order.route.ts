import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindOrderService } from "@/factories/services/order/make-find-order-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { orderParamsSchema } from "@/schemas/order-schema.js";
import { orderPayloadSchema } from "@/schemas/response-schema.js";
import type { FilterParams } from "@/types/crud.js";

export const findOrderRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findMyOrder",
        tags: customerTags("Orders"),
        summary: "Buscar pedido pelo ID (Customer)",
        params: orderParamsSchema,
        response: {
          200: apiSuccessResponseSchema(orderPayloadSchema),
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const filterParams: FilterParams = {};

      const findOrderService = makeFindOrderService();

      const order = await findOrderService.handle({
        id,
        filterParams,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Pedido encontrado com sucesso", order));
    },
  );
};
