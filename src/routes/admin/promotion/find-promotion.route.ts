import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindPromotionService } from "@/factories/services/promotion/make-find-promotion-service.js";
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
import { promotionParamsSchema } from "@/schemas/promotion-schema.js";
import { promotionResponseSchema } from "@/schemas/response-schema.js";

export const findPromotionRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findPromotion",
        tags: adminTags("Promotions"),
        summary: "Encontrar uma promoção",
        params: promotionParamsSchema,
        response: {
          200: apiSuccessResponseSchema(promotionResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
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
      const { id } = request.params;

      const findPromotionService = makeFindPromotionService();

      const { promotionProducts, promotionCategories, windows, ...promotion } =
        await findPromotionService.handle({
          id,
          filterParams: {
            establishment_id: getUserEstablishmentId(request.user),
          },
        });

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Promoção encontrada com sucesso", {
          ...promotion,
          windows: windows.map((window) => ({
            id: window.id,
            day_of_week: window.day_of_week,
            opens_at: window.opens_at,
            closes_at: window.closes_at,
          })),
          product_ids: promotionProducts.map((item) => item.product_id),
          category_ids: promotionCategories.map((item) => item.category_id),
        }),
      );
    },
  );
};
