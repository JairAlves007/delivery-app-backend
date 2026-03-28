import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateBannerService } from "@/factories/services/banner/make-create-banner-service.js";
import { makeDeleteBannerService } from "@/factories/services/banner/make-delete-banner-service.js";
import { makeFindBannerService } from "@/factories/services/banner/make-find-banner-service.js";
import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.js";
import { makeUpdateBannerService } from "@/factories/services/banner/make-update-banner-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	bannerParamsSchema,
	createBannerBodySchema
} from "@/schemas/banner-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listBannerService = makeListBannerService();

		const banners = await listBannerService.handle({
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
			.send(ApiResponse.success("Banners listados com sucesso", banners));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = bannerParamsSchema.parse(request.params);

	try {
		const findBannerService = makeFindBannerService();

		const banner = await findBannerService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Banner encontrado com sucesso", banner));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createBannerBodySchema.parse(request.body);

	try {
		const createBannerService = makeCreateBannerService();

		await createBannerService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Banner criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = bannerParamsSchema.parse(request.params);
	const body = createBannerBodySchema.parse(request.body);

	try {
		const updateBannerService = makeUpdateBannerService();

		await updateBannerService.handle({
			id,
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Banner atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = bannerParamsSchema.parse(request.params);

	try {
		const deleteBannerService = makeDeleteBannerService();

		await deleteBannerService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Banner deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
