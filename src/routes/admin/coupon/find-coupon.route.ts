import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { couponParamsSchema } from "@/schemas/coupon-schema.js";
import { couponResponseSchema } from "@/schemas/response-schema.js";

export const findCouponRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				tags: ["Coupons"],
				summary: "Encontrar um cupom",
				params: couponParamsSchema,
				response: {
					200: apiSuccessResponseSchema(couponResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_COUPONS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const findCouponService = makeFindCouponService();

			const coupon = await findCouponService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Cupom encontrado com sucesso", coupon));
		}
	);
};
