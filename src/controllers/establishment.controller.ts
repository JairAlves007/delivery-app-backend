import { makeCreateEstablishmentService } from "@/factories/services/make-create-establishment-service";
import { makeDeleteEstablishmentService } from "@/factories/services/make-delete-establishment-service";
import { makeListEstablishmentService } from "@/factories/services/make-list-establishment-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import {
	createEstablishmentBodySchema,
	deleteEstablishmentParamsSchema,
	listEstablishmentQueryParamsSchema
} from "@/schemas/establishment-schema";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listEstablishmentQueryParamsSchema.parse(request.query);

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

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = deleteEstablishmentParamsSchema.parse(request.params);

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
