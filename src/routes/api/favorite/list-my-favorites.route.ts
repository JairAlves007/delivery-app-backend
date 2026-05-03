import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListMyFavoritesService } from "@/factories/services/favorite/make-list-my-favorites-service.js";
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
import {
  listCursorQueryParamsSchema,
  userIdSchema,
} from "@/schemas/generic-schema.js";
import { myFavoritesResponseSchema } from "@/schemas/response-schema.js";

export const listMyFavoritesRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listMyFavorites",
        tags: customerTags("Favorites"),
        summary: "Listar meus produtos favoritos",
        querystring: listCursorQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(myFavoritesResponseSchema),
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
      const { limit, cursor } = request.query;
      const userId = userIdSchema.parse(request.user.sub);
      const establishmentId = request.user.activeTenantId;

      const service = makeListMyFavoritesService();

      const favorites = await service.handle({
        userId,
        establishmentId,
        limit,
        cursor,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success("Favoritos listados com sucesso", favorites),
        );
    },
  );
};
