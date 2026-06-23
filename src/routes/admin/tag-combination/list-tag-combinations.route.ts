import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListTagCombinationsService } from "@/factories/services/tag-combination/make-list-tag-combinations-service.js";
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
import { tagCombinationListResponseSchema } from "@/schemas/response-schema.js";

export const listTagCombinationsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listTagCombinations",
        tags: adminTags("TagCombinations"),
        summary: "Listar combinações de tags",
        response: {
          200: apiSuccessResponseSchema(tagCombinationListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
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
      const listTagCombinationsService = makeListTagCombinationsService();

      const combinations = await listTagCombinationsService.handle({
        establishmentId: getUserEstablishmentId(request.user),
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(
          ApiResponse.success(
            "Combinações listadas com sucesso",
            combinations,
          ),
        );
    },
  );
};
