import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListComboService } from "@/factories/services/combo/make-list-combo-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { comboListResponseSchema } from "@/schemas/response-schema.js";

export const listCombosRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listCombos",
        tags: adminTags("Combos"),
        summary: "Listar combos",
        querystring: listQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(comboListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_COMBOS]),
      ],
    },
    async (request, reply) => {
      const { search, sortField, sortDirection, ...query } = request.query;

      const listComboService = makeListComboService();

      const combos = await listComboService.handle({
        ...query,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
          search,
          sortField,
          sortDirection,
        },
      });

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Combos listados com sucesso", {
          ...combos,
          items: combos.items.map((combo) => ({
            ...combo,
            price: transformPriceFromDatabase(combo.price),
          })),
        }),
      );
    },
  );
};
