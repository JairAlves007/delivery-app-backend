import { makeCreateProductCategoryService } from "@/factories/services/product/category/make-create-product-category-service.ts";
import { makeDeleteProductCategoryService } from "@/factories/services/product/category/make-delete-product-category-service.ts";
import { makeFindProductCategoryService } from "@/factories/services/product/category/make-find-product-category-service.ts";
import { makeListProductCategoryService } from "@/factories/services/product/category/make-list-product-category-service.ts";
import { makeUpdateProductCategoryService } from "@/factories/services/product/category/make-update-product-category-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import {
	createProductCategoryBodySchema,
	productCategoryParamsSchema,
	updateProductCategoryBodySchema
} from "@/schemas/product-category-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listQueryParamsSchema.parse(request.query);

	try {
		const listProductCategoryService = makeListProductCategoryService();

		const productCategories = await listProductCategoryService.handle({
			...query,
			filterParams: { establishment_id: request.user.establishmentId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Categorias de produtos listadas com sucesso",
					productCategories
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productCategoryParamsSchema.parse(request.params);

	try {
		const findProductCategoryService = makeFindProductCategoryService();

		const productCategory = await findProductCategoryService.handle({
			id,
			filterParams: { establishment_id: request.user.establishmentId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Categoria de produto encontrado com sucesso",
					productCategory
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createProductCategoryBodySchema.parse(request.body);

	try {
		const createProductCategoryService = makeCreateProductCategoryService();

		await createProductCategoryService.handle(body);

		return reply
			.status(HTTPStatusCodes.CREATED)
			.send(ApiResponse.success("Categoria de produto criada com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productCategoryParamsSchema.parse(request.params);
	const data = updateProductCategoryBodySchema.parse(request.body);

	try {
		const updateProductCategoryService = makeUpdateProductCategoryService();

		await updateProductCategoryService.handle(id, data);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(
				ApiResponse.success("Categoria de produto atualizada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = productCategoryParamsSchema.parse(request.params);

	try {
		const deleteProductCategoryService = makeDeleteProductCategoryService();

		await deleteProductCategoryService.handle(id);

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(
				ApiResponse.success("Categoria de produto deletada com sucesso", {})
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
