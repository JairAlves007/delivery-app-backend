import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListAddonService } from "@/factories/services/addon/make-list-addon-service.js";
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
import { addonListResponseSchema } from "@/schemas/response-schema.js";

export const listAddonsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listAddons",
        tags: ["Addons"],
        summary: "Listar adicionais",
        querystring: listQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(addonListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS]),
      ],
    },
    async (request, reply) => {
      const { search, sortField, sortDirection, ...query } = request.query;

      const listAddonService = makeListAddonService();

      const addons = await listAddonService.handle({
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
        .send(ApiResponse.success("Adicionais listados com sucesso", addons));
    },
  );
};
