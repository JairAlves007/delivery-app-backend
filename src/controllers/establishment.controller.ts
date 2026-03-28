import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateEstablishmentService } from "@/factories/services/establishment/make-create-establishment-service.js";
import { makeDeleteEstablishmentService } from "@/factories/services/establishment/make-delete-establishment-service.js";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import { makeListEstablishmentService } from "@/factories/services/establishment/make-list-establishment-service.js";
import { makeUpdateEstablishmentService } from "@/factories/services/establishment/make-update-establishment-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	createEstablishmentBodySchema,
	establishmentParamsSchema,
	updateEstablishmentBodySchema
} from "@/schemas/establishment-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listQueryParamsSchema.parse(request.query);

	try {
		const listEstablishmentService = makeListEstablishmentService();

		const establishments = await listEstablishmentService.handle(query);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Estabelecimentos listados com sucesso",
					establishments
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = establishmentParamsSchema.parse(request.params);

	try {
		const findEstablishmentService = makeFindEstablishmentByIdService();

		const establishment = await findEstablishmentService.handle({ id });

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Estabelecimento encontrado com sucesso",
					establishment
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createEstablishmentBodySchema.parse(request.body);

	try {
		const createEstablishmentService = makeCreateEstablishmentService();

		await createEstablishmentService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Estabelecimento criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const data = updateEstablishmentBodySchema.parse(request.body);
	const { id } = establishmentParamsSchema.parse(request.params);

	try {
		const updateEstablishmentService = makeUpdateEstablishmentService();

		await updateEstablishmentService.handle({
			id,
			...data,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Estabelecimento atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = establishmentParamsSchema.parse(request.params);

	try {
		const deleteEstablishmentService = makeDeleteEstablishmentService();

		await deleteEstablishmentService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Estabelecimento deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
