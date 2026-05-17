import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDetachProductAddonCategoryService } from "@/factories/services/product-addon-category/make-detach-product-addon-category-service.js";
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
} from "@/schemas/api-schema.js";
import { productAddonCategoryParamsSchema } from "@/schemas/product-addon-category-schema.js";

export const detachProductAddonCategoryRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:productId/addon-categories/:categoryId",
    {
      schema: {
        operationId: "detachProductAddonCategory",
        tags: adminTags("Product Addon Categories"),
        summary: "Desvincular categoria de adicionais do produto",
        params: productAddonCategoryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS]),
      ],
    },
    async (request, reply) => {
      const { productId, categoryId } = request.params;
      const establishmentId = getUserEstablishmentId(request.user);

      const service = makeDetachProductAddonCategoryService();

      await service.handle({
        productId,
        addonCategoryId: categoryId,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Vínculo removido com sucesso", {}));
    },
  );
};
