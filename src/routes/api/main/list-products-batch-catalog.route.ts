import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeListProductsBatchCatalogService } from "@/factories/services/product/make-list-products-batch-catalog-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { batchProductsBodySchema } from "@/schemas/product-schema.js";
import { productDetailResponseSchema } from "@/schemas/response-schema.js";

export const listProductsBatchCatalogRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/:establishmentId/products/batch",
		{
			schema: {
				operationId: "listProductsBatchCatalog",
				tags: customerTags("Main (Home)"),
				summary: "Listar produtos por lista de IDs (sacola e favoritos)",
				params: z.object({
					establishmentId: establishmentIdSchema
				}),
				body: batchProductsBodySchema,
				response: {
					200: apiSuccessResponseSchema(z.array(productDetailResponseSchema)),
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const { establishmentId } = request.params;
			const { ids } = request.body;

			const listProductsBatchCatalogService =
				makeListProductsBatchCatalogService();

			const products = await listProductsBatchCatalogService.handle({
				ids,
				filterParams: {
					establishment_id: establishmentId
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success("Produtos encontrados com sucesso", products)
				);
		}
	);
};
