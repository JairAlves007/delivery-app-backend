import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { createOrderQueue } from "@/queues/order-queue.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { createOrderBodySchema } from "@/schemas/order-schema.js";

export const createOrderRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        operationId: "createOrder",
        tags: customerTags("Orders"),
        summary: "Criar um pedido",
        body: createOrderBodySchema,
        response: {
          202: apiSuccessResponseSchema(z.object({})),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      await createOrderQueue({
        order: body,
        paramsToForget: { establishment_id: body.establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.ACCEPTED)
        .send(
          ApiResponse.success(
            "Estamos processando seu pedido, em instantes você receberá uma notificação.",
            {},
          ),
        );
    },
  );
};
