import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeListBannerService } from "@/factories/services/banner/make-list-banner-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { bannerListResponseSchema } from "@/schemas/response-schema.js";

export const listBannersCatalogRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId/banners",
    {
      schema: {
        operationId: "listBannersCatalog",
        tags: customerTags("Main (Home)"),
        summary: "Listar banners na home",
        params: z.object({ establishmentId: establishmentIdSchema }),
        response: {
          200: apiSuccessResponseSchema(bannerListResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { establishmentId } = request.params;

      const listBannerService = makeListBannerService();

      const banners = await listBannerService.handle({
        perPage: 12,
        filterParams: {
          establishment_id: establishmentId,
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Banners listados com sucesso", banners));
    },
  );
};
