import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ServiceUnavailable } from "@/errors/health/service-unavailable.js";
import { makeCheckReadinessService } from "@/factories/services/health/make-check-readiness-service.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sharedTags } from "@/http/swagger-tags.js";
import {
  apiErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { readinessResponseSchema } from "@/schemas/response-schema.js";

export const readyRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/ready",
    {
      config: { rateLimit: Constants.RATE_LIMIT.health },
      schema: {
        operationId: "healthReady",
        tags: sharedTags("Health"),
        summary:
          "Verificar se a API e suas dependências estão prontas (readiness)",
        response: {
          200: apiSuccessResponseSchema(readinessResponseSchema),
          503: apiErrorResponseSchema(readinessResponseSchema),
        },
      },
    },
    async (_request, reply) => {
      const checkReadinessService = makeCheckReadinessService();

      const result = await checkReadinessService.handle();

      reply.header("Cache-Control", Constants.HEALTH_CACHE_CONTROL);

      if (result.status === "degraded")
        return reply
          .status(HTTPStatusCodes.SERVICE_UNAVAILABLE)
          .send(ApiResponse.error(new ServiceUnavailable(), result));

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("OK", result));
    },
  );
};
