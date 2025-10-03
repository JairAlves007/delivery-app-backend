import { makeCreateAddonService } from "@/factories/services/addon/make-create-addon-service.ts";
import { makeDeleteAddonService } from "@/factories/services/addon/make-delete-addon-service.ts";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.ts";
import { makeListAddonService } from "@/factories/services/addon/make-list-addon-service.ts";
import { makeUpdateAddonService } from "@/factories/services/addon/make-update-addon-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	addonParamsSchema,
	createAddonBodySchema,
	updateAddonBodySchema
} from "@/schemas/addon-schema.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import { RoleType } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listQueryParamsSchema.parse(request.query);

	if (request.user.role === RoleType.ESTABLISHMENT_OWNER)
		query.establishmentId = request.user.establishmentId;

	try {
		const listAddonService = makeListAddonService();

		const addonCategories = await listAddonService.handle(query);

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

		const addon = await findAddonService.handle({ id });

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

		await createAddonService.handle(body);

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

		await updateAddonService.handle(id, body);

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

		await deleteAddonService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(
				ApiResponse.success("Categoria de adicional deletada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
