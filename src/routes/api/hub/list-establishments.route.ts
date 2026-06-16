import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListHubEstablishmentsService } from "@/factories/services/hub/make-list-hub-establishments-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { hubListEstablishmentsQuerySchema } from "@/schemas/hub-schema.js";
import { hubEstablishmentListResponseSchema } from "@/schemas/response-schema.js";

export const listHubEstablishmentsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/establishments",
    {
      schema: {
        operationId: "listHubEstablishments",
        tags: customerTags("Hub"),
        summary: "Listar estabelecimentos disponíveis no hub",
        querystring: hubListEstablishmentsQuerySchema,
        response: {
          200: apiSuccessResponseSchema(hubEstablishmentListResponseSchema),
          400: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const listHubEstablishmentsService = makeListHubEstablishmentsService();

      const establishments = await listHubEstablishmentsService.handle(
        request.query,
      );

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Estabelecimentos do hub listados com sucesso",
            establishments,
          ),
        );
    },
  );
};
