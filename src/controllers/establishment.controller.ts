import { makeCreateEstablishmentService } from "@/factories/services/make-create-establishment-service";
import { makeListEstablishmentService } from "@/factories/services/make-list-establishment-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import {
	createEstablishmentBodySchema,
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
		const establishmentRepository = makeCreateEstablishmentService();

		await establishmentRepository.handle(body);

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Estabelecimento criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
