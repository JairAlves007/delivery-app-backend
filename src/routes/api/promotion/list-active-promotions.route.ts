import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { makeListActivePromotionsService } from "@/factories/services/promotion/make-list-active-promotions-service.js";
import { DiscountType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { activePromotionListResponseSchema } from "@/schemas/response-schema.js";

export const listActivePromotionsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId",
    {
      schema: {
        operationId: "listActivePromotions",
        tags: customerTags("Promotions"),
        summary: "Listar promoções ativas",
        params: z.object({ establishmentId: establishmentIdSchema }),
        response: {
          200: apiSuccessResponseSchema(activePromotionListResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { establishmentId } = request.params;

      const listActivePromotionsService = makeListActivePromotionsService();

      const promotions = await listActivePromotionsService.handle({
        establishmentId,
      });

      const mapped = promotions.map((promotion) => ({
        id: promotion.id,
        name: promotion.name,
        type: promotion.type,
        discount_type: promotion.discount_type,
        value:
          promotion.value != null &&
          promotion.discount_type === DiscountType.FIXED
            ? transformPriceFromDatabase(promotion.value)
            : promotion.value,
        scope: promotion.scope,
        min_order_value:
          promotion.min_order_value == null
            ? null
            : transformPriceFromDatabase(promotion.min_order_value),
      }));

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Promoções ativas listadas com sucesso", mapped));
    },
  );
};
