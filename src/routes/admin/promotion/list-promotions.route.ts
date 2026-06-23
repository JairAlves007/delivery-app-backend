import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListPromotionService } from "@/factories/services/promotion/make-list-promotion-service.js";
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
import { promotionListResponseSchema } from "@/schemas/response-schema.js";

export const listPromotionsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listPromotions",
        tags: adminTags("Promotions"),
        summary: "Listar promoções",
        querystring: listQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(promotionListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PROMOTIONS]),
      ],
    },
    async (request, reply) => {
      const { search, sortField, sortDirection, ...query } = request.query;

      const listPromotionService = makeListPromotionService();

      const promotions = await listPromotionService.handle({
        ...query,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
          search,
          sortField,
          sortDirection,
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Promoções listadas com sucesso", promotions));
    },
  );
};
