import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeAttachProductAddonCategoryService } from "@/factories/services/product-addon-category/make-attach-product-addon-category-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import {
  attachProductAddonCategoryBodySchema,
  productIdParamsSchema,
} from "@/schemas/product-addon-category-schema.js";

export const attachProductAddonCategoryRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/:productId/addon-categories",
    {
      schema: {
        operationId: "attachProductAddonCategory",
        tags: adminTags("Product Addon Categories"),
        summary: "Vincular categoria de adicionais a um produto",
        params: productIdParamsSchema,
        body: attachProductAddonCategoryBodySchema,
        response: {
          201: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          409: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS]),
      ],
    },
    async (request, reply) => {
      const { productId } = request.params;
      const body = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const service = makeAttachProductAddonCategoryService();

      await service.handle({
        ...body,
        productId,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.CREATED)
        .send(
          ApiResponse.success(
            "Categoria de adicionais vinculada ao produto",
            {},
          ),
        );
    },
  );
};
