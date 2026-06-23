import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeQuoteOrderService } from "@/factories/services/order/make-quote-order-service.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { quoteOrderBodySchema } from "@/schemas/order-schema.js";
import { quoteOrderResponseSchema } from "@/schemas/response-schema.js";

export const quoteOrderRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/quote",
    {
      config: { rateLimit: Constants.RATE_LIMIT.createOrder },
      schema: {
        operationId: "quoteOrder",
        tags: customerTags("Orders"),
        summary: "Calcular o total de um pedido (preview)",
        body: quoteOrderBodySchema,
        response: {
          200: apiSuccessResponseSchema(quoteOrderResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const quoteOrderService = makeQuoteOrderService();

      const quote = await quoteOrderService.handle(request.body);

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Total calculado com sucesso", quote));
    },
  );
};
