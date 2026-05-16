import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeFindProductService } from "@/factories/services/product/make-find-product-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { productParamsSchema } from "@/schemas/product-schema.js";
import { productDetailResponseSchema } from "@/schemas/response-schema.js";

export const findProductCatalogRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:establishmentId/product/:productId",
		{
			schema: {
				operationId: "findProductCatalog",
				tags: customerTags("Main (Home)"),
				summary: "Encontrar produto pelo ID na home do customer",
				params: z.object({
					establishmentId: establishmentIdSchema,
					productId: productParamsSchema.shape.id
				}),
				response: {
					200: apiSuccessResponseSchema(productDetailResponseSchema),
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const { establishmentId, productId } = request.params;

			const findProductService = makeFindProductService();

			const product = await findProductService.handle({
				id: productId,
				filterParams: {
					establishment_id: establishmentId
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Produto encontrado com sucesso", product));
		}
	);
};
