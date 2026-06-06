import { WhatsappProviderError } from "@/errors/whatsapp/whatsapp-provider-error.js";
import {
  type Prisma,
  WhatsappConnectionStatus,
  WhatsappMessageDirection,
  WhatsappMessageStatus,
} from "@/generated/prisma/client.js";
import { getStatusLabel } from "@/helpers/order.js";
import { normalizeToBrazilianJid } from "@/helpers/phone.js";
import {
  DEFAULT_STATUS_TEMPLATES,
  renderTemplate,
} from "@/helpers/whatsapp-templates.js";
import { app } from "@/http/app.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { IWhatsappMessageLogRepository } from "@/interfaces/repositories/whatsapp-message-log-repository.js";
import type { SendWhatsappMessageJob } from "@/types/whatsapp.js";

type BuildLogParams = {
  job: SendWhatsappMessageJob;
  recipient: string;
  status: WhatsappMessageStatus;
  payload: Prisma.InputJsonValue;
  error?: string | null;
  providerMessageId?: string | null;
};

export class SendOrderStatusMessageService {
  private integrationRepository: IEstablishmentWhatsappIntegrationRepository;
  private templateRepository: IOrderStatusMessageTemplateRepository;
  private messageLogRepository: IWhatsappMessageLogRepository;
  private establishmentRepository: IEstablishmentRepository;
  private whatsappProvider: IWhatsappProvider;

  constructor(
    integrationRepository: IEstablishmentWhatsappIntegrationRepository,
    templateRepository: IOrderStatusMessageTemplateRepository,
    messageLogRepository: IWhatsappMessageLogRepository,
    establishmentRepository: IEstablishmentRepository,
    whatsappProvider: IWhatsappProvider,
  ) {
    this.integrationRepository = integrationRepository;
    this.templateRepository = templateRepository;
    this.messageLogRepository = messageLogRepository;
    this.establishmentRepository = establishmentRepository;
    this.whatsappProvider = whatsappProvider;
  }

  private buildLog({
    job,
    recipient,
    status,
    payload,
    error,
    providerMessageId,
  }: BuildLogParams): Prisma.WhatsappMessageLogCreateInput {
    return {
      direction: WhatsappMessageDirection.OUTBOUND,
      status,
      recipient,
      order_status: job.orderStatus,
      payload,
      error: error ?? null,
      provider_message_id: providerMessageId ?? null,
      establishment: { connect: { id: job.establishmentId } },
      ...(job.orderId ? { order: { connect: { id: job.orderId } } } : {}),
    };
  }

  private async resolveText(job: SendWhatsappMessageJob): Promise<string> {
    if (job.body) return job.body;

    const template = await this.templateRepository.findByEstablishmentAndStatus({
      establishmentId: job.establishmentId,
      status: job.orderStatus,
    });

    const body = template?.body ?? DEFAULT_STATUS_TEMPLATES[job.orderStatus];

    const establishment = await this.establishmentRepository.findById({
      id: job.establishmentId,
    });

    return renderTemplate(body, {
      customerName: job.context?.customerName ?? "",
      orderId: job.context?.orderId ?? job.orderId ?? "",
      statusLabel: getStatusLabel(job.orderStatus),
      establishmentName: establishment?.name ?? "",
      orderTotal: job.context?.orderTotal ?? "",
      orderCreatedAt: job.context?.orderCreatedAt ?? "",
    });
  }

  async handle(job: SendWhatsappMessageJob): Promise<void> {
    const integration = await this.integrationRepository.findByEstablishmentId(
      job.establishmentId,
    );

    if (
      !integration ||
      integration.status !== WhatsappConnectionStatus.CONNECTED
    ) {
      await this.messageLogRepository.create(
        this.buildLog({
          job,
          recipient: job.recipientPhone,
          status: WhatsappMessageStatus.FAILED,
          error: "WhatsApp não conectado",
          payload: { reason: "not_connected" },
        }),
      );

      return;
    }

    let recipient: string;

    try {
      recipient = normalizeToBrazilianJid(job.recipientPhone);
    } catch {
      await this.messageLogRepository.create(
        this.buildLog({
          job,
          recipient: job.recipientPhone,
          status: WhatsappMessageStatus.FAILED,
          error: "Número de telefone inválido",
          payload: { reason: "invalid_phone" },
        }),
      );

      return;
    }

    const text = await this.resolveText(job);

    try {
      const result = await this.whatsappProvider.sendTextMessage({
        instanceName: integration.instance_name,
        instanceToken: integration.instance_token,
        recipient,
        text,
      });

      await this.messageLogRepository.create(
        this.buildLog({
          job,
          recipient,
          status: WhatsappMessageStatus.SENT,
          providerMessageId: result.providerMessageId,
          payload: {
            recipient,
            text,
            response: result.raw as Prisma.InputJsonValue,
          },
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      await this.messageLogRepository.create(
        this.buildLog({
          job,
          recipient,
          status: WhatsappMessageStatus.FAILED,
          error: message,
          payload: { recipient, text },
        }),
      );

      app.log.error({ error }, "[Whatsapp] failed to send order status message");

      const isTransient =
        error instanceof WhatsappProviderError &&
        (error.providerStatus === null || error.providerStatus >= 500);

      if (isTransient) throw error;
    }
  }
}
