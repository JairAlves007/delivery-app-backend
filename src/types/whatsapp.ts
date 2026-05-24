import type { OrderMessageTrigger } from "@/generated/prisma/client.js";

export type WhatsAppTemplateContext = Record<string, string>;

export type SendWhatsAppMessageJob = {
	establishmentId: string;
	orderId?: string | null;
	trigger: OrderMessageTrigger;
	toPhone: string;
	context: WhatsAppTemplateContext;
	fallbackMessage?: string;
};
