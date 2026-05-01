import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindOrderService } from "@/factories/services/order/make-find-order-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import {
  establishmentIdSchema,
  userIdSchema,
} from "@/schemas/generic-schema.js";
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
      const establishmentId = establishmentIdSchema.parse(
        request.user.primaryTenantId,
      );
      const userId = userIdSchema.parse(request.user.sub);

      const filterParams: FilterParams = {
        establishment_id: establishmentId,
        user_id: userId,
      };

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
