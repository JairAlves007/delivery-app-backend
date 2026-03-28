import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateDistrictService } from "@/factories/services/district/make-create-district-service.js";
import { makeDeleteDistrictService } from "@/factories/services/district/make-delete-district-service.js";
import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.js";
import { makeListDistrictService } from "@/factories/services/district/make-list-district-service.js";
import { makeUpdateDistrictService } from "@/factories/services/district/make-update-district-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	createDistrictBodySchema,
	districtParamsSchema,
	updateDistrictBodySchema
} from "@/schemas/district-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listDistrictService = makeListDistrictService();

		const districts = await listDistrictService.handle({
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
			.send(ApiResponse.success("Bairros listados com sucesso", districts));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = districtParamsSchema.parse(request.params);

	try {
		const findDistrictService = makeFindDistrictService();

		const district = await findDistrictService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Bairro encontrado com sucesso", district));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createDistrictBodySchema.parse(request.body);

	try {
		const createDistrictService = makeCreateDistrictService();

		await createDistrictService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Bairro criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = districtParamsSchema.parse(request.params);
	const body = updateDistrictBodySchema.parse(request.body);

	try {
		const updateDistrictService = makeUpdateDistrictService();

		await updateDistrictService.handle({
			id,
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Bairro atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = districtParamsSchema.parse(request.params);

	try {
		const deleteDistrictService = makeDeleteDistrictService();

		await deleteDistrictService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Bairro deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
