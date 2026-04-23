import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListCouponService } from "@/factories/services/coupon/make-list-coupon-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { resolveEstablishmentScope } from "@/helpers/resolve-establishment-scope.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { couponListResponseSchema } from "@/schemas/response-schema.js";

export const listCouponsRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listCoupons",
				tags: ["Coupons"],
				summary: "Listar cupons",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(couponListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
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
			const {
				search,
				sortField,
				sortDirection,
				establishmentId,
				...query
			} = request.query;

			const listCouponService = makeListCouponService();

			const coupons = await listCouponService.handle({
				...query,
				filterParams: {
					establishment_id: resolveEstablishmentScope({
						role: request.user.role,
						primaryTenantId: request.user.primaryTenantId,
						establishmentId
					}),
					search,
					sortField,
					sortDirection
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Cupons listados com sucesso", coupons));
		}
	);
};
