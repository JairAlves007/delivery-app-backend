import z from "zod";

import {
  OrderStatusType,
  WhatsappConnectionStatus,
} from "@/generated/prisma/client.js";

export const connectWhatsappResponseSchema = z.object({
  status: z.enum(WhatsappConnectionStatus),
  qrCodeBase64: z.string().nullable(),
  pairingCode: z.string().nullable(),
});

z.globalRegistry.add(connectWhatsappResponseSchema, {
  id: "ConnectWhatsappResponse",
});

export const whatsappStatusResponseSchema = z.object({
  instanceName: z.string(),
  status: z.enum(WhatsappConnectionStatus),
  connectedNumber: z.string().nullable(),
});

z.globalRegistry.add(whatsappStatusResponseSchema, {
  id: "WhatsappStatusResponse",
});

export const upsertOrderStatusTemplateBodySchema = z.object({
  body: z
    .string("A mensagem deve ser preenchida")
    .trim()
    .min(1, "A mensagem deve ser preenchida")
    .max(4000, "A mensagem deve ter no máximo 4000 caracteres"),
  isActive: z.boolean().optional(),
});

z.globalRegistry.add(upsertOrderStatusTemplateBodySchema, {
  id: "UpsertOrderStatusTemplateBody",
});

export const orderStatusTemplateParamsSchema = z.object({
  status: z.enum(OrderStatusType, "O status do pedido deve ser preenchido"),
});

export const orderStatusTemplateQuerySchema = z.object({
  scheduled: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export const orderStatusTemplateResponseSchema = z.object({
  status: z.enum(OrderStatusType),
  isScheduled: z.boolean(),
  body: z.string(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

z.globalRegistry.add(orderStatusTemplateResponseSchema, {
  id: "OrderStatusTemplateResponse",
});

export const listOrderStatusTemplatesResponseSchema = z.object({
  templates: z.array(orderStatusTemplateResponseSchema),
});

z.globalRegistry.add(listOrderStatusTemplatesResponseSchema, {
  id: "ListOrderStatusTemplatesResponse",
});

export const whatsappWebhookParamsSchema = z.object({
  token: z.string().min(1, "Token do webhook é obrigatório"),
});

export const whatsappWebhookBodySchema = z.looseObject({
  event: z.string(),
  instance: z.string(),
  data: z.unknown().optional(),
});
