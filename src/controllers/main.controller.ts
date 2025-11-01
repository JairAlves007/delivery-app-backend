import { env } from "@/env.ts";
import { InvalidEstablishment } from "@/errors/user/invalid-establishment-error.ts";
import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.ts";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.ts";
import { makeGetMenuService } from "@/factories/services/main/make-get-menu-service.ts";
import { makeProfileService } from "@/factories/services/main/make-get-profile-service.ts";
import { makeListProductCategoriesCatalogService } from "@/factories/services/product/category/make-list-product-categories-catalog-service.ts";
import { makeListProductsFromCategoryCatalogService } from "@/factories/services/product/make-list-products-from-category-catalog-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { isEstablishmentOpen } from "@/helpers/establishment.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	establishmentParamsSchema,
	listCursorQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.ts";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const profileData = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const { establishmentId } = establishmentParamsSchema.parse(request.params);
	const userId = userIdSchema.parse(request.user.sub);

	try {
		const getMenuService = makeGetMenuService();
		const getProfileService = makeProfileService();
		const findEstablishmentService = makeFindEstablishmentByIdService();

		const establishment = await findEstablishmentService.handle({
			id: establishmentId
		});

		if (!establishment) throw new InvalidEstablishment();

		const menu = await getMenuService.handle(
			request.user.role,
			establishmentId
		);
		const profile = await getProfileService.handle({
			id: userId
		});

		return reply.status(HTTPStatusCodes.OK).send(
			ApiResponse.success("Dados carregados com sucesso", {
				menu,
				profile,
				establishment: {
					...establishment,
					isOpen: isEstablishmentOpen(establishment)
				},
				bucketUrl: env.PUBLIC_BUCKET_URL
			})
		);
	} catch (error) {
		return reply.sendError(error);
	}
};

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
