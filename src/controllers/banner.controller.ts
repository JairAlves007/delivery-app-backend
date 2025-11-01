import { makeCreateBannerService } from "@/factories/services/banner/make-create-banner-service.ts";
import { makeDeleteBannerService } from "@/factories/services/banner/make-delete-banner-service.ts";
import { makeFindBannerService } from "@/factories/services/banner/make-find-banner-service.ts";
import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.ts";
import { makeUpdateBannerService } from "@/factories/services/banner/make-update-banner-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	bannerParamsSchema,
	createBannerBodySchema
} from "@/schemas/banner-schema.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortOrder, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listBannerService = makeListBannerService();

		const banners = await listBannerService.handle({
			...query,
			filterParams: {
				establishment_id: request.user.myEstablishmentId,
				search,
				sortField,
				sortOrder
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
			filterParams: { establishment_id: request.user.myEstablishmentId }
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

		await createBannerService.handle(body);

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

		await updateBannerService.handle(id, body);

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

		await deleteBannerService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Banner deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
