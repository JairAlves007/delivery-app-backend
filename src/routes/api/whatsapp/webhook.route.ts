import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { env } from "@/env.js";
import { WhatsappWebhookUnauthorized } from "@/errors/whatsapp/whatsapp-webhook-unauthorized.js";
import { makeHandleWhatsappWebhookService } from "@/factories/services/whatsapp/make-handle-whatsapp-webhook-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sharedTags } from "@/http/swagger-tags.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import {
  whatsappWebhookBodySchema,
  whatsappWebhookParamsSchema,
} from "@/schemas/whatsapp-schema.js";
import type { WhatsappWebhookPayload } from "@/types/whatsapp.js";

export const whatsappWebhookRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/webhook/:token",
    {
      schema: {
        operationId: "whatsappWebhook",
        tags: sharedTags("Whatsapp"),
        summary: "Webhook de eventos da Evolution API",
        params: whatsappWebhookParamsSchema,
        body: whatsappWebhookBodySchema,
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          422: apiValidationErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { token } = request.params;

      if (token !== env.EVOLUTION_WEBHOOK_TOKEN)
        throw new WhatsappWebhookUnauthorized();

      try {
        const handleWhatsappWebhookService = makeHandleWhatsappWebhookService();
        await handleWhatsappWebhookService.handle(
          request.body as unknown as WhatsappWebhookPayload,
        );
      } catch (error) {
        request.log.error({ error }, "[Whatsapp] webhook processing failed");
      }

      return reply.status(HTTPStatusCodes.OK).send(ApiResponse.success("ok", {}));
    },
  );
};
