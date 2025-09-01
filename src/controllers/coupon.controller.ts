import { makeCreateCouponService } from "@/factories/services/coupon/make-create-coupon-service.ts";
import { makeDeleteCouponService } from "@/factories/services/coupon/make-delete-coupon-service.ts";
import { makeListCouponService } from "@/factories/services/coupon/make-list-coupon-service.ts";
import { makeUpdateCouponService } from "@/factories/services/coupon/make-update-coupon-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	couponParamsSchema,
	createCouponBodySchema
} from "@/schemas/coupon-schema.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = paginationQueryParamsSchema.parse(request.query);

	try {
		const listCouponService = makeListCouponService();

		const coupons = await listCouponService.handle(query);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Cupons listados com sucesso", coupons));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createCouponBodySchema.parse(request.body);

	try {
		const createCouponService = makeCreateCouponService();

		await createCouponService.handle(body);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Cupom criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = couponParamsSchema.parse(request.params);
	const body = createCouponBodySchema.parse(request.body);

	try {
		const updateCouponService = makeUpdateCouponService();

		await updateCouponService.handle(id, body);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Cupom atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = couponParamsSchema.parse(request.params);

	try {
		const deleteCouponService = makeDeleteCouponService();

		await deleteCouponService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Cupom deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
