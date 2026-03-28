import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateAddressService } from "@/factories/services/address/make-create-address-service.js";
import { makeDeleteAddressService } from "@/factories/services/address/make-delete-address-service.js";
import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.js";
import { makeListAddressService } from "@/factories/services/address/make-list-address-service.js";
import { makeUpdateAddressService } from "@/factories/services/address/make-update-address-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	addressParamsSchema,
	createAddressBodySchema,
	updateAddressBodySchema
} from "@/schemas/address-schema.js";
import {
	listCursorQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.js";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const {
		search = undefined,
		sortField = undefined,
		sortDirection = undefined,
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
			filterParams: { establishment_id: request.user.primaryTenantId }
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

		await createAddressService.handle({
			userId,
			...body,
			paramsToForget: {
				user_id: userId
			}
		});

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

		await updateAddressService.handle({
			id,
			userId,
			...body,
			paramsToForget: {
				user_id: userId
			}
		});

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

		await deleteAddressService.handle({
			id,
			paramsToForget: { user_id: request.user.sub }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Endereço deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
