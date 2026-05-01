import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListProductCategoriesCatalogService } from "@/factories/services/product/category/make-list-product-categories-catalog-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.js";
import { productCategoriesCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listProductCategoriesCatalogRoute = async (
  app: FastifyInstance,
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/product/categories",
    {
      schema: {
        operationId: "listProductCategoriesCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar categorias de produtos na home",
        querystring: listCursorQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(productCategoriesCatalogResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.VIEW_CATALOG]),
      ],
    },
    async (request, reply) => {
      const { activeTenantId } = request.user;
      const query = request.query;

      const listProductCategoriesCatalogService =
        makeListProductCategoriesCatalogService();

      const categories = await listProductCategoriesCatalogService.handle({
        establishmentId: activeTenantId,
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
