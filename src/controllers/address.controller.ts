import { makeCreateAddressService } from "@/factories/services/address/make-create-address-service.ts";
import { makeDeleteAddressService } from "@/factories/services/address/make-delete-address-service.ts";
import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.ts";
import { makeListAddressService } from "@/factories/services/address/make-list-address-service.ts";
import { makeUpdateAddressService } from "@/factories/services/address/make-update-address-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	addressParamsSchema,
	createAddressBodySchema,
	updateAddressBodySchema
} from "@/schemas/address-schema.ts";
import {
	listCursorQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const {
		search = undefined,
		sortField = undefined,
		sortOrder = undefined,
		...query
	} = listCursorQueryParamsSchema.parse(request.query);
	const userId = userIdSchema.parse(request.user.sub);

	try {
		const listAddressService = makeListAddressService();

		const addresses = await listAddressService.handle({
			...query,
			filterParams: { user_id: userId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Endereços listados com sucesso", addresses));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addressParamsSchema.parse(request.params);

	try {
		const findAddressService = makeFindAddressService();

		const address = await findAddressService.handle({
			id,
			filterParams: { establishment_id: request.user.myEstablishmentId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Endereço encontrado com sucesso", address));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const userId = userIdSchema.parse(request.user.sub);
	const body = createAddressBodySchema.parse(request.body);

	try {
		const createAddressService = makeCreateAddressService();

		await createAddressService.handle({ userId, ...body });

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Endereço criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addressParamsSchema.parse(request.params);
	const userId = userIdSchema.parse(request.user.sub);
	const body = updateAddressBodySchema.parse(request.body);

	try {
		const updateAddressService = makeUpdateAddressService();

		await updateAddressService.handle(id, { userId, ...body });

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Endereço atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = addressParamsSchema.parse(request.params);

	try {
		const deleteAddressService = makeDeleteAddressService();

		await deleteAddressService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Endereço deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
