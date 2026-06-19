import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.js";
import { makeValidateCustomerPhoneFromOrderService } from "@/factories/services/order/validations/make-validate-customer-phone-from-order-service.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
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
      config: { rateLimit: Constants.RATE_LIMIT.createOrder },
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

      const validateCustomerPhoneService =
        makeValidateCustomerPhoneFromOrderService();
      const createOrderService = makeCreateOrderService();

      await validateCustomerPhoneService.handle({
        establishmentId: body.establishmentId,
        customerPhone: body.customerPhone,
      });

      const plan = await createOrderService.buildPlan({
        order: body,
        paramsToForget: { establishment_id: body.establishmentId },
      });

      await createOrderQueue(plan);

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
