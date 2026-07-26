import { env } from "@/env.js";
import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ConnectInstanceProviderResult } from "@/types/whatsapp.js";

type ConnectEstablishmentWhatsappRequest = {
  establishmentId: EstablishmentID;
};

const buildWebhookUrl = (): string =>
  `${env.BASE_URL}/api/whatsapp/webhook`;

const buildWebhookHeaders = (): Record<string, string> => ({
  [Constants.WHATSAPP_WEBHOOK_HEADER]: env.EVOLUTION_WEBHOOK_TOKEN,
});

export class ConnectEstablishmentWhatsappService {
  private integrationRepository: IEstablishmentWhatsappIntegrationRepository;
  private whatsappProvider: IWhatsappProvider;

  constructor(
    integrationRepository: IEstablishmentWhatsappIntegrationRepository,
    whatsappProvider: IWhatsappProvider,
  ) {
    this.integrationRepository = integrationRepository;
    this.whatsappProvider = whatsappProvider;
  }

  async handle({
    establishmentId,
  }: ConnectEstablishmentWhatsappRequest): Promise<ConnectInstanceProviderResult> {
    const existing =
      await this.integrationRepository.findByEstablishmentId(establishmentId);

    const instanceName = existing?.instance_name ?? `est_${establishmentId}`;
    let instanceToken = existing?.instance_token ?? null;

    if (!instanceToken) {
      const created = await this.whatsappProvider.createInstance({
        instanceName,
        webhookUrl: buildWebhookUrl(),
        webhookHeaders: buildWebhookHeaders(),
      });

      instanceToken = created.instanceToken;
    }

    await this.integrationRepository.upsert({
      establishmentId,
      instanceName,
      instanceToken,
      status: WhatsappConnectionStatus.CONNECTING,
    });

    const connection = await this.whatsappProvider.connect({
      instanceName,
      instanceToken,
    });

    await this.integrationRepository.updateStatus({
      establishmentId,
      status: connection.status,
    });

    return connection;
  }
}
