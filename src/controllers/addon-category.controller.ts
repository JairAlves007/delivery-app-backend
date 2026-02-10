import { makeCreateAddonCategoryService } from "@/factories/services/addon/category/make-create-addon-category-service.ts";
import { makeDeleteAddonCategoryService } from "@/factories/services/addon/category/make-delete-addon-category-service.ts";
import { makeFindAddonCategoryService } from "@/factories/services/addon/category/make-find-addon-category-service.ts";
import { makeListAddonCategoryService } from "@/factories/services/addon/category/make-list-addon-category-service.ts";
import { makeUpdateAddonCategoryService } from "@/factories/services/addon/category/make-update-addon-category-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	addonCategoryParamsSchema,
	createAddonCategoryBodySchema,
	updateAddonCategoryBodySchema
} from "@/schemas/addon-category-schema.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listAddonCategoryService = makeListAddonCategoryService();

		const addonCategories = await listAddonCategoryService.handle({
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
	const { id } = addonCategoryParamsSchema.parse(request.params);

	try {
		const findAddonCategoryService = makeFindAddonCategoryService();

		const addonCategory = await findAddonCategoryService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Categoria de adicional encontrada com sucesso",
					addonCategory
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createAddonCategoryBodySchema.parse(request.body);

	try {
		const createAddonCategoryService = makeCreateAddonCategoryService();

		await createAddonCategoryService.handle({
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
	const { id } = addonCategoryParamsSchema.parse(request.params);
	const body = updateAddonCategoryBodySchema.parse(request.body);

	try {
		const updateAddonCategoryService = makeUpdateAddonCategoryService();

		await updateAddonCategoryService.handle({
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
	const { id } = addonCategoryParamsSchema.parse(request.params);

	try {
		const deleteAddonCategoryService = makeDeleteAddonCategoryService();

		await deleteAddonCategoryService.handle({
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
