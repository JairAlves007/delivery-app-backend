import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.js";
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
import { bannerListResponseSchema } from "@/schemas/response-schema.js";

export const listBannersCatalogRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/banners",
    {
      schema: {
        operationId: "listBannersCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar banners na home",
        response: {
          200: apiSuccessResponseSchema(bannerListResponseSchema),
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

      const listBannerService = makeListBannerService();

      const banners = await listBannerService.handle({
        perPage: 12,
        filterParams: {
          establishment_id: activeTenantId,
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Banners listados com sucesso", banners));
    },
  );
};
