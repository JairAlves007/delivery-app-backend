import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateDistrictService } from "@/factories/services/district/make-update-district-service.js";
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
import {
  districtParamsSchema,
  updateDistrictBodySchema,
} from "@/schemas/district-schema.js";

export const updateDistrictRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/:id",
    {
      schema: {
        operationId: "updateDistrict",
        tags: adminTags("Districts"),
        summary: "Atualizar bairro",
        params: districtParamsSchema,
        body: updateDistrictBodySchema,
        response: {
          204: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const updateDistrictService = makeUpdateDistrictService();

      await updateDistrictService.handle({
        id,
        ...body,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.NO_CONTENT)
        .send(ApiResponse.success("Bairro atualizado com sucesso", {}));
    },
  );
};
