import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { env } from "@/env.js";
import { WhatsAppWebhookUnauthorized } from "@/errors/whatsapp/webhook-unauthorized-error.js";
import { makeWhatsAppMessageLogRepository } from "@/factories/repositories/make-whatsapp-message-log-repository.js";
import { WhatsAppMessageStatus } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { verifyHmacSha256 } from "@/helpers/crypto.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema
} from "@/schemas/api-schema.js";

const paramsSchema = z.object({
	establishmentId: z.ulid("Establishment id inválido")
});

const eventSchema = z.object({
	event: z.string().optional(),
	data: z
		.object({
			key: z
				.object({
					id: z.string().optional()
				})
				.optional(),
			messageId: z.string().optional(),
			status: z.string().optional(),
			timestamp: z.number().optional()
		})
		.optional()
});

const mapEventToStatus = (event: string | undefined): {
	status: WhatsAppMessageStatus;
	deliveredAt: Date | null;
	readAt: Date | null;
	failedAt: Date | null;
} | null => {
	const now = new Date();
	switch (event?.toLowerCase()) {
		case "delivery_ack":
		case "delivered":
			return {
				status: WhatsAppMessageStatus.DELIVERED,
				deliveredAt: now,
				readAt: null,
				failedAt: null
			};
		case "read":
		case "read_ack":
			return {
				status: WhatsAppMessageStatus.READ,
				deliveredAt: null,
				readAt: now,
				failedAt: null
			};
		case "failed":
		case "error":
			return {
				status: WhatsAppMessageStatus.FAILED,
				deliveredAt: null,
				readAt: null,
				failedAt: now
			};
		default:
			return null;
	}
};

const extractRawBody = (request: FastifyRequest): string => {
	if (typeof request.body === "string") return request.body;
	return JSON.stringify(request.body ?? {});
};

export const whatsAppWebhookRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/webhooks/whatsapp/:establishmentId",
		{
			schema: {
				operationId: "whatsAppWebhook",
				tags: ["Webhooks"],
				summary: "Recebe eventos de status do WhatsApp do Evolution API",
				params: paramsSchema,
				body: z.unknown(),
				response: {
					200: apiSuccessResponseSchema(z.null()),
					401: apiDefaultErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const signature =
				(request.headers["x-evolution-signature"] as string | undefined) ??
				(request.headers["x-hub-signature-256"] as string | undefined);

			if (!signature) {
				app.log.warn(
					{ establishmentId: request.params.establishmentId },
					"[WhatsApp webhook] missing signature header"
				);
				throw new WhatsAppWebhookUnauthorized("missing signature header");
			}

			const rawBody = extractRawBody(request);

			if (
				!verifyHmacSha256(rawBody, signature, env.EVOLUTION_WEBHOOK_SECRET)
			) {
				app.log.warn(
					{ establishmentId: request.params.establishmentId },
					"[WhatsApp webhook] invalid signature"
				);
				throw new WhatsAppWebhookUnauthorized("invalid signature");
			}

			const parsed = eventSchema.safeParse(request.body);
			if (!parsed.success) {
				app.log.info(
					{ establishmentId: request.params.establishmentId },
					"[WhatsApp webhook] payload shape not recognized — ignoring"
				);
				return reply
					.status(HTTPStatusCodes.OK)
					.send(ApiResponse.success("Ignored", null));
			}

			const providerMessageId =
				parsed.data.data?.key?.id ?? parsed.data.data?.messageId;
			const statusMap = mapEventToStatus(
				parsed.data.data?.status ?? parsed.data.event
			);

			if (!providerMessageId || !statusMap) {
				return reply
					.status(HTTPStatusCodes.OK)
					.send(ApiResponse.success("Ignored", null));
			}

			const repository = makeWhatsAppMessageLogRepository();
			await repository.updateByProviderMessageId({
				providerMessageId,
				status: statusMap.status,
				deliveredAt: statusMap.deliveredAt,
				readAt: statusMap.readAt,
				failedAt: statusMap.failedAt
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Processed", null));
		}
	);
};
