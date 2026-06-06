import type {
  Prisma,
  WhatsappMessageLog,
  WhatsappMessageStatus,
} from "@/generated/prisma/client.js";
import type { IWhatsappMessageLogRepository } from "@/interfaces/repositories/whatsapp-message-log-repository.js";
import prisma from "@/lib/prisma.js";

export class WhatsappMessageLogPrismaRepository
  implements IWhatsappMessageLogRepository
{
  async create(
    data: Prisma.WhatsappMessageLogCreateInput,
  ): Promise<WhatsappMessageLog> {
    return await prisma.whatsappMessageLog.create({ data });
  }

  async updateStatusByProviderMessageId({
    providerMessageId,
    status,
  }: {
    providerMessageId: string;
    status: WhatsappMessageStatus;
  }): Promise<void> {
    await prisma.whatsappMessageLog.updateMany({
      where: { provider_message_id: providerMessageId },
      data: { status },
    });
  }

  async listByEstablishment(
    establishmentId: string,
  ): Promise<WhatsappMessageLog[]> {
    return await prisma.whatsappMessageLog.findMany({
      where: { establishment_id: establishmentId },
      orderBy: { created_at: "desc" },
    });
  }
}
