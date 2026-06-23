import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreatePromotionService } from "@/factories/services/promotion/make-create-promotion-service.js";
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
import { createPromotionBodySchema } from "@/schemas/promotion-schema.js";

export const createPromotionRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        operationId: "createPromotion",
        tags: adminTags("Promotions"),
        summary: "Criar uma promoção",
        body: createPromotionBodySchema,
        response: {
          201: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
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
      const body = request.body;
      const establishmentId = getUserEstablishmentId(request.user);

      const createPromotionService = makeCreatePromotionService();

      await createPromotionService.handle({
        ...body,
        establishmentId,
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.CREATED)
        .send(ApiResponse.success("Promoção criada com sucesso", {}));
    },
  );
};
