import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateManualRecommendationService } from "@/factories/services/recommendation/make-create-manual-recommendation-service.js";
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
import { createRecommendationBodySchema } from "@/schemas/recommendation-schema.js";

export const createRecommendationRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        operationId: "createRecommendation",
        tags: adminTags("Recommendations"),
        summary: "Criar uma recomendação manual",
        body: createRecommendationBodySchema,
        response: {
          201: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
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
      const body = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const createManualRecommendationService =
        makeCreateManualRecommendationService();

      await createManualRecommendationService.handle({
        ...body,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.CREATED)
        .send(ApiResponse.success("Recomendação criada com sucesso", {}));
    },
  );
};
