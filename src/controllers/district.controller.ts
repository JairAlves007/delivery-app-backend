import { makeCreateDistrictService } from "@/factories/services/district/make-create-district-service.ts";
import { makeDeleteDistrictService } from "@/factories/services/district/make-delete-district-service.ts";
import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.ts";
import { makeListDistrictService } from "@/factories/services/district/make-list-district-service.ts";
import { makeUpdateDistrictService } from "@/factories/services/district/make-update-district-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	createDistrictBodySchema,
	districtParamsSchema,
	updateDistrictBodySchema
} from "@/schemas/district-schema.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortOrder, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listDistrictService = makeListDistrictService();

		const districts = await listDistrictService.handle({
			...query,
			filterParams: {
				establishment_id: request.user.establishmentId,
				search,
				sortField,
				sortOrder
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
			filterParams: { establishment_id: request.user.establishmentId }
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

		await createDistrictService.handle(body);

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

		await updateDistrictService.handle(id, body);

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

		await deleteDistrictService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Bairro deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
