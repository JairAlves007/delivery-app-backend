import { makeCreateEstablishmentService } from "@/factories/services/establishment/make-create-establishment-service.ts";
import { makeDeleteEstablishmentService } from "@/factories/services/establishment/make-delete-establishment-service.ts";
import { makeListEstablishmentService } from "@/factories/services/establishment/make-list-establishment-service.ts";
import { makeUpdateEstablishmentService } from "@/factories/services/establishment/make-update-establishment-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	createEstablishmentBodySchema,
	establishmentParamsSchema,
	updateEstablishmentBodySchema
} from "@/schemas/establishment-schema.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = paginationQueryParamsSchema.parse(request.query);

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

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createEstablishmentBodySchema.parse(request.body);

	try {
		const createEstablishmentService = makeCreateEstablishmentService();

		await createEstablishmentService.handle(body);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
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

		await updateEstablishmentService.handle(id, data);

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

		await deleteEstablishmentService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Estabelecimento deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
