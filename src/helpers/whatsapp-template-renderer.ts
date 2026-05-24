import type { WhatsAppTemplateContext } from "@/types/whatsapp.js";

export const renderWhatsAppTemplate = (
	template: string,
	context: WhatsAppTemplateContext
): string => {
	let result = template;
	for (const [key, value] of Object.entries(context)) {
		result = result.replaceAll(`{${key}}`, value);
	}
	return result;
};

export const sanitizePhoneForWhatsApp = (phone: string): string => {
	return phone.replace(/\D/g, "");
};
