import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListProductsFromCategoryCatalogService } from "@/factories/services/product/make-list-products-from-category-catalog-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import {
  establishmentIdSchema,
  listCursorQueryParamsSchema,
} from "@/schemas/generic-schema.js";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.js";
import { productsFromCategoryCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listProductsFromCategoryCatalogRoute = async (
  app: FastifyInstance,
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId/category/:categoryId/products",
    {
      schema: {
        operationId: "listProductsFromCategoryCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar produtos de uma categoria na home",
        params: listProductsFromCategorySchema.extend({
          establishmentId: establishmentIdSchema,
        }),
        querystring: listCursorQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(
            productsFromCategoryCatalogResponseSchema,
          ),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const query = request.query;
      const { categoryId, establishmentId } = request.params;

      const listProductsFromCategoryCatalogService =
        makeListProductsFromCategoryCatalogService();

      const products = await listProductsFromCategoryCatalogService.handle({
        establishmentId,
        categoryId,
        ...query,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Produtos da categoria listados com sucesso",
            products,
          ),
        );
    },
  );
};
