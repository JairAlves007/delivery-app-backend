import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.js";
import { makeCreateCouponService } from "@/factories/services/coupon/make-create-coupon-service.js";
import { makeDeleteCouponService } from "@/factories/services/coupon/make-delete-coupon-service.js";
import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.js";
import { makeListCouponService } from "@/factories/services/coupon/make-list-coupon-service.js";
import { makeUpdateCouponService } from "@/factories/services/coupon/make-update-coupon-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	checkCouponBodySchema,
	couponParamsSchema,
	createCouponBodySchema
} from "@/schemas/coupon-schema.js";
import {
	listQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listCouponService = makeListCouponService();

		const coupons = await listCouponService.handle({
			...query,
			filterParams: {
				establishment_id: request.user.primaryTenantId,
				search,
				sortField,
				sortDirection
			}
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Cupons listados com sucesso", coupons));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = couponParamsSchema.parse(request.params);

	try {
		const findCouponService = makeFindCouponService();

		const coupon = await findCouponService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Cupom encontrado com sucesso", coupon));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createCouponBodySchema.parse(request.body);

	try {
		const createCouponService = makeCreateCouponService();

		await createCouponService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
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

		await updateCouponService.handle({
			id,
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

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

		await deleteCouponService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Cupom deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const check = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = checkCouponBodySchema.parse(request.body);
	const userId = userIdSchema.parse(request.user.sub);
	const data = {
		...body,
		userId
	};

	try {
		const checkCouponService = makeCheckCouponService();

		const couponIsValid = await checkCouponService.handle(data);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success("Cupom foi checado com sucesso", couponIsValid)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
