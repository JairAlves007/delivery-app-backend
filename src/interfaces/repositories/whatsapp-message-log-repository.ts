import type {
  Prisma,
  WhatsappMessageLog,
  WhatsappMessageStatus,
} from "@/generated/prisma/client.js";

export interface IWhatsappMessageLogRepository {
  create(data: Prisma.WhatsappMessageLogCreateInput): Promise<WhatsappMessageLog>;
  updateStatusByProviderMessageId(params: {
    providerMessageId: string;
    status: WhatsappMessageStatus;
  }): Promise<void>;
  listByEstablishment(establishmentId: string): Promise<WhatsappMessageLog[]>;
}
