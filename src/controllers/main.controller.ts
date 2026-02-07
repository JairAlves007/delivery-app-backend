import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.ts";
import { makeListProductCategoriesCatalogService } from "@/factories/services/product/category/make-list-product-categories-catalog-service.ts";
import { makeListProductsFromCategoryCatalogService } from "@/factories/services/product/make-list-products-from-category-catalog-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	establishmentParamsSchema,
	listCursorQueryParamsSchema
} from "@/schemas/generic-schema.ts";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const listBannersCatalog = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const { establishmentId } = establishmentParamsSchema.parse(request.params);

	try {
		const listBannerService = makeListBannerService();

		const banners = await listBannerService.handle({
			perPage: 12,
			filterParams: {
				establishment_id: establishmentId
			}
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Banners listados com sucesso", banners));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const listProductCategoriesCatalog = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const { establishmentId } = establishmentParamsSchema.parse(request.params);
	const query = listCursorQueryParamsSchema.parse(request.query);

	try {
		const listProductCategoriesCatalogService =
			makeListProductCategoriesCatalogService();

		const categories = await listProductCategoriesCatalogService.handle({
			establishmentId,
			...query
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Categorias de produtos listadas com sucesso",
					categories
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const listProductsFromCategoryCatalog = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const query = listCursorQueryParamsSchema.parse(request.query);
	const { categoryId, establishmentId } = listProductsFromCategorySchema.parse(
		request.params
	);

	try {
		const listProductsFromCategoryCatalogService =
			makeListProductsFromCategoryCatalogService();

		const products = await listProductsFromCategoryCatalogService.handle({
			establishmentId,
			categoryId,
			...query
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"Produtos da categoria listados com sucesso",
					products
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
