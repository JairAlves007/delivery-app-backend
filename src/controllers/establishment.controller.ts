import { makeListEstablishmentService } from "@/factories/services/make-list-establishment-service";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { listEstablishmentQueryParamsSchema } from "@/schemas/establishment-schema";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listEstablishmentQueryParamsSchema.parse(request.query);

	try {
		const listEstablishmentService = makeListEstablishmentService();

		const establishments = await listEstablishmentService.handle(query);

		return reply.status(HTTPStatusCodes.OK).send(establishments);
	} catch (error) {
		return reply.sendError(error);
	}
};
