import { timingSafeEqual } from "node:crypto";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { env } from "@/env.js";
import { WhatsappWebhookUnauthorized } from "@/errors/whatsapp/whatsapp-webhook-unauthorized.js";
import { makeHandleWhatsappWebhookService } from "@/factories/services/whatsapp/make-handle-whatsapp-webhook-service.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sharedTags } from "@/http/swagger-tags.js";
import { redis } from "@/lib/redis.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
  apiValidationErrorResponseSchema,
} from "@/schemas/api-schema.js";
import { whatsappWebhookBodySchema } from "@/schemas/whatsapp-schema.js";
import type { WhatsappWebhookPayload } from "@/types/whatsapp.js";

const isValidWebhookToken = (provided: unknown): boolean => {
  if (typeof provided !== "string" || provided.length === 0) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(env.EVOLUTION_WEBHOOK_TOKEN);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

const buildDedupKey = (payload: WhatsappWebhookPayload): string | null => {
  const eventId = payload.data?.key?.id ?? payload.data?.keyId;
  if (!eventId) return null;
  return `whatsapp:webhook:dedup:${payload.instance}:${payload.event}:${eventId}`;
};

export const whatsappWebhookRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/webhook",
    {
      schema: {
        operationId: "whatsappWebhook",
        tags: sharedTags("Whatsapp"),
        summary: "Webhook de eventos da Evolution API",
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
      const providedToken = request.headers[Constants.WHATSAPP_WEBHOOK_HEADER];

      if (!isValidWebhookToken(providedToken))
        throw new WhatsappWebhookUnauthorized();

      const payload = request.body as unknown as WhatsappWebhookPayload;

      const dedupKey = buildDedupKey(payload);

      if (dedupKey) {
        const stored = await redis.set(
          dedupKey,
          "1",
          "EX",
          Constants.WHATSAPP_WEBHOOK_DEDUP_TTL_SECONDS,
          "NX",
        );

        if (stored === null)
          return reply
            .status(HTTPStatusCodes.OK)
            .send(ApiResponse.success("ok", {}));
      }

      const handleWhatsappWebhookService = makeHandleWhatsappWebhookService();
      await handleWhatsappWebhookService.handle(payload);

      return reply.status(HTTPStatusCodes.OK).send(ApiResponse.success("ok", {}));
    },
  );
};
