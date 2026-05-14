import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeFindEstablishmentBySlugService } from "@/factories/services/establishment/make-find-establishment-by-slug-service.js";
import { makeGetMenuService } from "@/factories/services/menu/make-get-menu-service.js";
import { MenuAudienceType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { establishmentContextResponseSchema } from "@/schemas/response-schema.js";

export const establishmentContextRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug",
    {
      schema: {
        operationId: "establishmentContext",
        tags: customerTags("Main (Home)"),
        summary: "Retorna estabelecimento ativo e menu do customer",
        params: z.object({
          slug: z.string().min(1, "O slug do estabelecimento deve ser preenchido"),
        }),
        response: {
          200: apiSuccessResponseSchema(establishmentContextResponseSchema),
          404: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const findEstablishmentBySlugService = makeFindEstablishmentBySlugService();
      const menuService = makeGetMenuService();

      const [establishmentData, menu] = await Promise.all([
        findEstablishmentBySlugService.handle(slug),
        menuService.handle(MenuAudienceType.CUSTOMER),
      ]);

      return reply.status(HTTPStatusCodes.OK).send(
        ApiResponse.success("Contexto do estabelecimento recuperado com sucesso", {
          establishment: {
            ...establishmentData,
            isOpen: isEstablishmentOpen(establishmentData),
          },
          menu,
        }),
      );
    },
  );
};
