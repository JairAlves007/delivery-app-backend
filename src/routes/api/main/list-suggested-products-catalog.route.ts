import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListSuggestedProductsCatalogService } from "@/factories/services/product/make-list-suggested-products-catalog-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import {
  listSuggestedProductsParamsSchema,
  listSuggestedProductsQuerySchema,
} from "@/schemas/main-schema.js";
import { suggestedProductsCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listSuggestedProductsCatalogRoute = async (
  app: FastifyInstance,
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId/product/:productId/suggested",
    {
      schema: {
        operationId: "listSuggestedProductsCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar produtos sugeridos a partir de um produto",
        params: listSuggestedProductsParamsSchema.extend({
          establishmentId: establishmentIdSchema,
        }),
        querystring: listSuggestedProductsQuerySchema,
        response: {
          200: apiSuccessResponseSchema(suggestedProductsCatalogResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { productId, establishmentId } = request.params;
      const { limit } = request.query;

      const listSuggestedProductsCatalogService =
        makeListSuggestedProductsCatalogService();

      const products = await listSuggestedProductsCatalogService.handle({
        establishmentId,
        productId,
        limit,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Produtos sugeridos listados com sucesso",
            products,
          ),
        );
    },
  );
};
