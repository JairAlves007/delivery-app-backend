import {
  type Prisma,
  WhatsappConnectionStatus,
  WhatsappMessageDirection,
  WhatsappMessageStatus,
} from "@/generated/prisma/client.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { IWhatsappMessageLogRepository } from "@/interfaces/repositories/whatsapp-message-log-repository.js";
import type { WhatsappWebhookPayload } from "@/types/whatsapp.js";

const mapState = (state?: string): WhatsappConnectionStatus => {
  if (state === "open") return WhatsappConnectionStatus.CONNECTED;
  if (state === "connecting") return WhatsappConnectionStatus.CONNECTING;
  return WhatsappConnectionStatus.DISCONNECTED;
};

const mapReceiptStatus = (status?: string): WhatsappMessageStatus | null => {
  if (status === "READ" || status === "PLAYED")
    return WhatsappMessageStatus.READ;
  if (status === "DELIVERY_ACK" || status === "SERVER_ACK")
    return WhatsappMessageStatus.DELIVERED;
  return null;
};

export class HandleWhatsappWebhookService {
  private integrationRepository: IEstablishmentWhatsappIntegrationRepository;
  private messageLogRepository: IWhatsappMessageLogRepository;

  constructor(
    integrationRepository: IEstablishmentWhatsappIntegrationRepository,
    messageLogRepository: IWhatsappMessageLogRepository,
  ) {
    this.integrationRepository = integrationRepository;
    this.messageLogRepository = messageLogRepository;
  }

  async handle(payload: WhatsappWebhookPayload): Promise<void> {
    const integration = await this.integrationRepository.findByInstanceName(
      payload.instance,
    );

    if (!integration) return;

    const event = payload.event.toUpperCase().replaceAll(".", "_");
    const data = payload.data;

    if (event === "CONNECTION_UPDATE") {
      await this.integrationRepository.updateStatus({
        establishmentId: integration.establishment_id,
        status: mapState(data?.state),
      });

      return;
    }

    if (event === "MESSAGES_UPDATE") {
      const providerMessageId = data?.key?.id ?? data?.keyId;
      const status = mapReceiptStatus(data?.status);

      if (providerMessageId && status)
        await this.messageLogRepository.updateStatusByProviderMessageId({
          providerMessageId,
          status,
        });

      return;
    }

    if (
      event === "MESSAGES_UPSERT" &&
      data?.key?.fromMe === false &&
      data.key.remoteJid?.endsWith("@s.whatsapp.net")
    ) {
      await this.messageLogRepository.create({
        direction: WhatsappMessageDirection.INBOUND,
        status: WhatsappMessageStatus.RECEIVED,
        recipient: data.key.remoteJid ?? "",
        payload: data as unknown as Prisma.InputJsonValue,
        provider_message_id: data.key.id ?? null,
        establishment: { connect: { id: integration.establishment_id } },
      });
    }
  }
}
