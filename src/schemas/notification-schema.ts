import { z } from "zod";

export const notificationParamsSchema = z.object({
  id: z.ulid("Notificação inválida"),
});

export const listNotificationsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limite inválido")
    .max(50, "Limite inválido")
    .default(12),
  cursor: z.ulid("Cursor inválido").nullable().optional(),
});

export const sseStreamQuerySchema = z.object({
  ticket: z
    .string()
    .regex(/^[a-f0-9]{48}$/, "Ticket inválido"),
});
