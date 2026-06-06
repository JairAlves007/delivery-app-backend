import { createReadStream } from "node:fs";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeServeDigitalMenuService } from "@/factories/services/digital-menu/make-serve-digital-menu-service.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { digitalMenuSlugParamsSchema } from "@/schemas/digital-menu-schema.js";

export const getDigitalMenuPdfRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/digital-menu",
    {
      schema: {
        operationId: "getDigitalMenuPdf",
        tags: customerTags("Main (Home)"),
        summary: "Retorna o cardápio digital em PDF do estabelecimento",
        params: digitalMenuSlugParamsSchema,
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const serveDigitalMenuService = makeServeDigitalMenuService();

      const { absolutePath, fileName } = await serveDigitalMenuService.handle({
        slug,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .header("Content-Type", Constants.DIGITAL_MENU_MIME_TYPE)
        .header("Content-Disposition", `inline; filename="${fileName}"`)
        .send(createReadStream(absolutePath));
    },
  );
};
