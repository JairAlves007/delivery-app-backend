import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeSearchProductsCatalogService } from "@/factories/services/product/make-search-products-catalog-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { searchProductsCatalogQuerySchema } from "@/schemas/main-schema.js";
import { searchProductsCatalogResponseSchema } from "@/schemas/response-schema.js";

export const searchProductsCatalogRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId/products/search",
    {
      schema: {
        operationId: "searchProductsCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Buscar produtos do catálogo por termo",
        params: z.object({ establishmentId: establishmentIdSchema }),
        querystring: searchProductsCatalogQuerySchema,
        response: {
          200: apiSuccessResponseSchema(searchProductsCatalogResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { establishmentId } = request.params;
      const query = request.query;

      const searchProductsCatalogService = makeSearchProductsCatalogService();

      const products = await searchProductsCatalogService.handle({
        establishmentId,
        ...query,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Produtos do catálogo encontrados com sucesso",
            products,
          ),
        );
    },
  );
};
