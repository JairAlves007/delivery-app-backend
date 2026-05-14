import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeListProductCategoriesCatalogService } from "@/factories/services/product/category/make-list-product-categories-catalog-service.js";
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
import { productCategoriesCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listProductCategoriesCatalogRoute = async (
  app: FastifyInstance,
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId/product/categories",
    {
      schema: {
        operationId: "listProductCategoriesCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar categorias de produtos na home",
        params: z.object({ establishmentId: establishmentIdSchema }),
        querystring: listCursorQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(productCategoriesCatalogResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { establishmentId } = request.params;
      const query = request.query;

      const listProductCategoriesCatalogService =
        makeListProductCategoriesCatalogService();

      const categories = await listProductCategoriesCatalogService.handle({
        establishmentId,
        ...query,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Categorias de produtos listadas com sucesso",
            categories,
          ),
        );
    },
  );
};
