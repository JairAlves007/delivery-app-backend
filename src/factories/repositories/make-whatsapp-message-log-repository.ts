import { WhatsappMessageLogPrismaRepository } from "@/repositories/whatsapp-message-log-prisma-repository.js";

export const makeWhatsappMessageLogRepository = () => {
  return new WhatsappMessageLogPrismaRepository();
};
