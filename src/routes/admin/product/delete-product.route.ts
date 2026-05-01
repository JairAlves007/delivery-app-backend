import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteProductService } from "@/factories/services/product/make-delete-product-service.js";
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
import { productParamsSchema } from "@/schemas/product-schema.js";

export const deleteProductRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        operationId: "deleteProduct",
        tags: adminTags("Products"),
        summary: "Deletar produto",
        params: productParamsSchema,
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
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS]),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;
      const establishmentId = getUserEstablishmentId(request.user);

      const deleteProductService = makeDeleteProductService();

      await deleteProductService.handle({
        id,
        filterParams: { establishment_id: establishmentId },
        paramsToForget: { establishment_id: establishmentId },
      });

      return reply
        .status(HTTPStatusCodes.NO_CONTENT)
        .send(ApiResponse.success("Produto deletado com sucesso", {}));
    },
  );
};
