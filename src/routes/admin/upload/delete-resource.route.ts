import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteResourceService } from "@/factories/services/upload/make-delete-resource-service.js";
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
import { deleteResourceParamsSchema } from "@/schemas/upload-schema.js";

export const deleteResourceRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:resourceId",
    {
      schema: {
        operationId: "deleteResource",
        tags: adminTags("Uploads"),
        summary: "Deletar um recurso (imagem) do bucket e do banco",
        params: deleteResourceParamsSchema,
        response: {
          202: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([
          PermissionType.MANAGE_ESTABLISHMENTS,
          PermissionType.MANAGE_BANNERS,
          PermissionType.MANAGE_PRODUCTS,
          PermissionType.MANAGE_CATEGORIES,
        ]),
      ],
    },
    async (request, reply) => {
      const { resourceId } = request.params;
      const establishmentId = getUserEstablishmentId(request.user);

      const deleteResourceService = makeDeleteResourceService();

      await deleteResourceService.handle({
        resourceId,
        establishmentId,
      });

      return reply
        .status(HTTPStatusCodes.ACCEPTED)
        .send(
          ApiResponse.success(
            "Remoção do recurso enfileirada com sucesso",
            {},
          ),
        );
    },
  );
};
