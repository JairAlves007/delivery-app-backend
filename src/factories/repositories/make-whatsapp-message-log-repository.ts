import { WhatsAppMessageLogPrismaRepository } from "@/repositories/whatsapp-message-log-prisma-repository.js";

export const makeWhatsAppMessageLogRepository = () => {
	return new WhatsAppMessageLogPrismaRepository();
};
