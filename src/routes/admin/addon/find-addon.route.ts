import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { addonParamsSchema } from "@/schemas/addon-schema.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { addonResponseSchema } from "@/schemas/response-schema.js";

export const findAddonRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        operationId: "findAddon",
        tags: ["Addons"],
        summary: "Encontrar adicional pelo ID",
        params: addonParamsSchema,
        response: {
          200: apiSuccessResponseSchema(addonResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
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
      const { id } = request.params;

      const findAddonService = makeFindAddonService();

      const addon = await findAddonService.handle({
        id,
        filterParams: {
          establishment_id: getUserEstablishmentId(request.user),
        },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Adicional encontrado com sucesso", addon));
    },
  );
};
