import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateAddonService } from "@/factories/services/addon/make-create-addon-service.js";
import { makeDeleteAddonService } from "@/factories/services/addon/make-delete-addon-service.js";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.js";
import { makeListAddonService } from "@/factories/services/addon/make-list-addon-service.js";
import { makeUpdateAddonService } from "@/factories/services/addon/make-update-addon-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	addonParamsSchema,
	createAddonBodySchema,
	updateAddonBodySchema
} from "@/schemas/addon-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listAddonService = makeListAddonService();

		const addonCategories = await listAddonService.handle({
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
			.send(
				ApiResponse.success(
					"Categorias de adicionais listadas com sucesso",
					addonCategories
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addonParamsSchema.parse(request.params);

	try {
		const findAddonService = makeFindAddonService();

		const addon = await findAddonService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Adicional encontrado com sucesso", addon));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createAddonBodySchema.parse(request.body);

	try {
		const createAddonService = makeCreateAddonService();

		await createAddonService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(
				ApiResponse.success("Categoria de adicional criada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addonParamsSchema.parse(request.params);
	const body = updateAddonBodySchema.parse(request.body);

	try {
		const updateAddonService = makeUpdateAddonService();

		await updateAddonService.handle({
			id,
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(
				ApiResponse.success("Categoria de adicional atualizada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addonParamsSchema.parse(request.params);

	try {
		const deleteAddonService = makeDeleteAddonService();

		await deleteAddonService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(
				ApiResponse.success("Categoria de adicional deletada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
