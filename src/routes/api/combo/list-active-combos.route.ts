import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { makeListActiveCombosService } from "@/factories/services/combo/make-list-active-combos-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { comboCatalogListResponseSchema } from "@/schemas/response-schema.js";

export const listActiveCombosRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:establishmentId",
    {
      schema: {
        operationId: "listActiveCombos",
        tags: customerTags("Combos"),
        summary: "Listar combos ativos",
        params: z.object({ establishmentId: establishmentIdSchema }),
        response: {
          200: apiSuccessResponseSchema(comboCatalogListResponseSchema),
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { establishmentId } = request.params;

      const listActiveCombosService = makeListActiveCombosService();

      const combos = await listActiveCombosService.handle({ establishmentId });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Combos listados com sucesso", combos));
    },
  );
};
