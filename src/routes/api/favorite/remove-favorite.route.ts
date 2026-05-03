import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeRemoveFavoriteService } from "@/factories/services/favorite/make-remove-favorite-service.js";
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
import { userIdSchema } from "@/schemas/generic-schema.js";
import { productParamsSchema } from "@/schemas/product-schema.js";

const responseSchema = z.object({});

export const removeFavoriteRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        operationId: "removeFavorite",
        tags: customerTags("Favorites"),
        summary: "Desfavoritar um produto",
        params: productParamsSchema,
        response: {
          200: apiSuccessResponseSchema(responseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.ADD_TO_CART]),
      ],
    },
    async (request, reply) => {
      const { id: productId } = request.params;
      const userId = userIdSchema.parse(request.user.sub);
      const establishmentId = request.user.activeTenantId;

      const service = makeRemoveFavoriteService();
      await service.handle({ userId, productId, establishmentId });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Produto removido dos favoritos"));
    },
  );
};
