import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeUploadDigitalMenuService } from "@/factories/services/digital-menu/make-upload-digital-menu-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiEmptyDetailsResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { uploadDigitalMenuBodySchema } from "@/schemas/digital-menu-schema.js";

const BASE64_OVERHEAD_FACTOR = 1.4;

export const uploadDigitalMenuRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      bodyLimit: Math.ceil(
        Constants.DIGITAL_MENU_MAX_UPLOAD_BYTES * BASE64_OVERHEAD_FACTOR,
      ),
      schema: {
        operationId: "uploadDigitalMenu",
        tags: adminTags("Cardápio Digital"),
        summary: "Envia um cardápio digital em PDF já pronto",
        body: uploadDigitalMenuBodySchema,
        response: {
          200: apiEmptyDetailsResponseSchema,
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
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
      const { fileBase64, mimeType } = request.body;

      const uploadDigitalMenuService = makeUploadDigitalMenuService();

      await uploadDigitalMenuService.handle({
        establishmentId,
        fileBase64,
        mimeType,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Cardápio enviado com sucesso", {}));
    },
  );
};
