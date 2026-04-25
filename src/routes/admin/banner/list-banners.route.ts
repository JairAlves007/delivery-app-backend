import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { bannerListResponseSchema } from "@/schemas/response-schema.js";

export const listBannersRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listBanners",
        tags: ["Banners"],
        summary: "Listar banners",
        querystring: listQueryParamsSchema,
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
        ensureUserHasPermission([PermissionType.MANAGE_BANNERS]),
      ],
    },
    async (request, reply) => {
      const { search, sortField, sortDirection, ...query } = request.query;

      const listBannerService = makeListBannerService();

      const banners = await listBannerService.handle({
        ...query,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
          search,
          sortField,
          sortDirection,
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Banners listados com sucesso", banners));
    },
  );
};
