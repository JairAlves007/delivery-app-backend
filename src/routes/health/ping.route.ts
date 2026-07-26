import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sharedTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { healthResponseSchema } from "@/schemas/response-schema.js";

export const pingRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/ping",
    {
      config: { rateLimit: Constants.RATE_LIMIT.health },
      schema: {
        operationId: "healthPing",
        tags: sharedTags("Health"),
        summary: "Verificar se o processo da API está no ar (liveness)",
        response: {
          200: apiSuccessResponseSchema(healthResponseSchema),
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      return reply
        .status(HTTPStatusCodes.OK)
        .header("Cache-Control", Constants.HEALTH_CACHE_CONTROL)
        .send(ApiResponse.success("OK", { status: "OK" }));
    },
  );
};
