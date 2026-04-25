import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindAddonCategoryService } from "@/factories/services/addon/category/make-find-addon-category-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { addonCategoryParamsSchema } from "@/schemas/addon-category-schema.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { addonCategoryResponseSchema } from "@/schemas/response-schema.js";

export const findAddonCategoryRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findAddonCategory",
        tags: ["Addon Categories"],
        summary: "Encontrar categoria de adicionais pelo ID",
        params: addonCategoryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(addonCategoryResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;

      const findAddonCategoryService = makeFindAddonCategoryService();

      const addonCategory = await findAddonCategoryService.handle({
        id,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Categoria de adicional encontrada com sucesso",
            addonCategory,
          ),
        );
    },
  );
};
