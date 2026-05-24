import type { OrderStatusMessageTemplate } from "@/generated/prisma/client.js";

export type OrderStatusMessageTemplatePayload = {
	id: string;
	trigger: OrderStatusMessageTemplate["trigger"];
	enabled: boolean;
	templateText: string;
	updatedAt: string;
};

export const mapOrderStatusMessageTemplate = (
	row: OrderStatusMessageTemplate
): OrderStatusMessageTemplatePayload => {
	return {
		id: row.id,
		trigger: row.trigger,
		enabled: row.enabled,
		templateText: row.template_text,
		updatedAt: row.updated_at.toISOString()
	};
};
