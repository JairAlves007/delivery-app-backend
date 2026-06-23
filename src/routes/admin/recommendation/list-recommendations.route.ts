import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListManualRecommendationsService } from "@/factories/services/recommendation/make-list-manual-recommendations-service.js";
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
import { recommendationListResponseSchema } from "@/schemas/response-schema.js";

export const listRecommendationsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listRecommendations",
        tags: adminTags("Recommendations"),
        summary: "Listar recomendações manuais",
        response: {
          200: apiSuccessResponseSchema(recommendationListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_RECOMMENDATIONS]),
      ],
    },
    async (request, reply) => {
      const listManualRecommendationsService =
        makeListManualRecommendationsService();

      const recommendations = await listManualRecommendationsService.handle({
        establishmentId: getUserEstablishmentId(request.user),
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Recomendações listadas com sucesso",
            recommendations,
          ),
        );
    },
  );
};
