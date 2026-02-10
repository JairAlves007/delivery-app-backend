import { makeCreateProductService } from "@/factories/services/product/make-create-product-service.ts";
import { makeDeleteProductService } from "@/factories/services/product/make-delete-product-service.ts";
import { makeFindProductService } from "@/factories/services/product/make-find-product-service.ts";
import { makeListProductService } from "@/factories/services/product/make-list-product-service.ts";
import { makeUpdateProductService } from "@/factories/services/product/make-update-product-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import {
	createProductBodySchema,
	productParamsSchema,
	updateProductBodySchema
} from "@/schemas/product-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const { search, sortField, sortDirection, ...query } =
		listQueryParamsSchema.parse(request.query);

	try {
		const listProductService = makeListProductService();

		const products = await listProductService.handle({
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
			.send(ApiResponse.success("Produtos listados com sucesso", products));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productParamsSchema.parse(request.params);

	try {
		const findProductService = makeFindProductService();

		const product = await findProductService.handle({
			id,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Produto encontrado com sucesso", product));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createProductBodySchema.parse(request.body);

	try {
		const createProductService = makeCreateProductService();

		await createProductService.handle({
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Produto criado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productParamsSchema.parse(request.params);
	const data = updateProductBodySchema.parse(request.body);

	try {
		const updateProductService = makeUpdateProductService();

		await updateProductService.handle({
			id,
			...data,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Produto atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productParamsSchema.parse(request.params);

	try {
		const deleteProductService = makeDeleteProductService();

		await deleteProductService.handle({
			id,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Produto deletado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
