import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeRequestDigitalMenuGenerationService } from "@/factories/services/digital-menu/make-request-digital-menu-generation-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiEmptyDetailsResponseSchema,
} from "@/schemas/api-schema.js";

export const generateDigitalMenuRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/generate",
    {
      schema: {
        operationId: "generateDigitalMenu",
        tags: adminTags("Cardápio Digital"),
        summary: "Solicita a geração do cardápio digital em PDF",
        response: {
          202: apiEmptyDetailsResponseSchema,
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_DIGITAL_MENU]),
      ],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const requestDigitalMenuGenerationService =
        makeRequestDigitalMenuGenerationService();

      await requestDigitalMenuGenerationService.handle({ establishmentId });

      return reply
        .status(HTTPStatusCodes.ACCEPTED)
        .send(
          ApiResponse.success(
            "Geração do cardápio iniciada. O PDF estará disponível em instantes.",
            {},
          ),
        );
    },
  );
};
