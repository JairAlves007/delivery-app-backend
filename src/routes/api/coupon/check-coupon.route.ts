import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { checkCouponBodySchema } from "@/schemas/coupon-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";
import { checkCouponResponseSchema } from "@/schemas/response-schema.js";

export const checkCouponRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/check",
    {
      schema: {
        operationId: "checkCoupon",
        tags: ["Coupons"],
        summary: "Checar validade de um cupom",
        body: checkCouponBodySchema,
        response: {
          200: apiSuccessResponseSchema(checkCouponResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.CUSTOMER])],
    },
    async (request, reply) => {
      const body = request.body;
      const userId = userIdSchema.parse(request.user.sub);
      const data = {
        ...body,
        userId,
      };

      const checkCouponService = makeCheckCouponService();

      const couponIsValid = await checkCouponService.handle(data);

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success("Cupom foi checado com sucesso", couponIsValid),
        );
    },
  );
};
