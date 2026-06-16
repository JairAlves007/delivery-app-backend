import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListHubFiltersService } from "@/factories/services/hub/make-list-hub-filters-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { hubFiltersResponseSchema } from "@/schemas/response-schema.js";

export const listHubFiltersRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/establishments/filters",
    {
      schema: {
        operationId: "listHubFilters",
        tags: customerTags("Hub"),
        summary: "Listar cozinhas disponíveis para filtro no hub",
        response: {
          200: apiSuccessResponseSchema(hubFiltersResponseSchema),
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const listHubFiltersService = makeListHubFiltersService();

      const filters = await listHubFiltersService.handle();

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Filtros do hub listados com sucesso", filters));
    },
  );
};
