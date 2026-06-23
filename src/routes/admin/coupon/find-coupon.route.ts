import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.js";
import { DiscountType, PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { couponParamsSchema } from "@/schemas/coupon-schema.js";
import { couponResponseSchema } from "@/schemas/response-schema.js";

export const findCouponRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findCoupon",
        tags: adminTags("Coupons"),
        summary: "Encontrar um cupom",
        params: couponParamsSchema,
        response: {
          200: apiSuccessResponseSchema(couponResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_COUPONS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;

      const findCouponService = makeFindCouponService();

      const { couponProducts, couponCategories, ...coupon } =
        await findCouponService.handle({
          id,
          filterParams: {
            establishment_id: getUserEstablishmentId(request.user),
          },
        });

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Cupom encontrado com sucesso", {
          ...coupon,
          value:
            coupon.discount_type === DiscountType.FIXED
              ? transformPriceFromDatabase(coupon.value)
              : coupon.value,
          min_order_value:
            coupon.min_order_value == null
              ? null
              : transformPriceFromDatabase(coupon.min_order_value),
          product_ids: couponProducts.map((item) => item.product_id),
          category_ids: couponCategories.map((item) => item.category_id),
        }),
      );
    },
  );
};
