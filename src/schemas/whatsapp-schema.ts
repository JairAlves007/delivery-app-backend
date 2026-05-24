import z from "zod";

import {
	OrderMessageTrigger,
	WhatsAppIntegrationStatus
} from "@/generated/prisma/client.js";

export const connectWhatsAppBodySchema = z.object({
	metaPhoneNumberId: z
		.string()
		.regex(/^\d+$/, "ID do número de telefone deve ser numérico")
		.min(1, "ID do número de telefone é obrigatório")
		.max(64),
	metaWabaId: z
		.string()
		.regex(/^\d+$/, "WABA ID deve ser numérico")
		.min(1, "WABA ID é obrigatório")
		.max(64),
	metaAccessToken: z
		.string()
		.min(100, "Token deve ter no mínimo 100 caracteres — gere um token permanente")
});

z.globalRegistry.add(connectWhatsAppBodySchema, {
	id: "ConnectWhatsAppBody"
});

export const orderMessageTriggerSchema = z.enum(OrderMessageTrigger);

export const upsertOrderStatusMessageTemplateParamsSchema = z.object({
	trigger: orderMessageTriggerSchema
});

export const upsertOrderStatusMessageTemplateBodySchema = z.object({
	enabled: z.boolean(),
	templateText: z
		.string()
		.min(10, "Template muito curto")
		.max(1024, "Limite WhatsApp: 1024 caracteres")
});

z.globalRegistry.add(upsertOrderStatusMessageTemplateBodySchema, {
	id: "UpsertOrderStatusMessageTemplateBody"
});

export const whatsAppIntegrationResponseSchema = z.object({
	id: z.string(),
	status: z.enum(WhatsAppIntegrationStatus),
	metaPhoneNumberId: z.string(),
	metaWabaId: z.string(),
	lastConnectedAt: z.iso.datetime().nullable(),
	lastError: z.string().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime()
});

export const whatsAppIntegrationNullableResponseSchema =
	whatsAppIntegrationResponseSchema.nullable();

export const orderStatusMessageTemplateResponseSchema = z.object({
	id: z.string(),
	trigger: orderMessageTriggerSchema,
	enabled: z.boolean(),
	templateText: z.string(),
	updatedAt: z.iso.datetime()
});

export const orderStatusMessageTemplatesListResponseSchema = z.array(
	orderStatusMessageTemplateResponseSchema
);
