import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListAddressService } from "@/factories/services/address/make-list-address-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import {
  listCursorQueryParamsSchema,
  userIdSchema,
} from "@/schemas/generic-schema.js";
import { addressListResponseSchema } from "@/schemas/response-schema.js";

export const listAddressesRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listAddresses",
        tags: customerTags("Addresses"),
        summary: "Listar endereços",
        querystring: listCursorQueryParamsSchema,
        response: {
          200: apiSuccessResponseSchema(addressListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES]),
      ],
    },
    async (request, reply) => {
      const query = request.query;
      const userId = userIdSchema.parse(request.user.sub);

      const listAddressService = makeListAddressService();

      const addresses = await listAddressService.handle({
        ...query,
        filterParams: { user_id: userId },
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Endereços listados com sucesso", addresses));
    },
  );
};
