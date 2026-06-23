import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdatePromotionService } from "@/factories/services/promotion/make-update-promotion-service.js";
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
  createPromotionBodySchema,
  promotionParamsSchema,
} from "@/schemas/promotion-schema.js";

export const updatePromotionRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/:id",
    {
      schema: {
        operationId: "updatePromotion",
        tags: adminTags("Promotions"),
        summary: "Atualizar uma promoção",
        params: promotionParamsSchema,
        body: createPromotionBodySchema,
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
        ensureUserHasPermission([PermissionType.MANAGE_PROMOTIONS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const updatePromotionService = makeUpdatePromotionService();

      await updatePromotionService.handle({
        id,
        ...body,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.NO_CONTENT)
        .send(ApiResponse.success("Promoção atualizada com sucesso", {}));
    },
  );
};
