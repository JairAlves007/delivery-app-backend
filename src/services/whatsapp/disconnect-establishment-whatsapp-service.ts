import { WhatsappIntegrationNotFound } from "@/errors/whatsapp/whatsapp-integration-not-found.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DisconnectEstablishmentWhatsappRequest = {
  establishmentId: EstablishmentID;
};

export class DisconnectEstablishmentWhatsappService {
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
  }: DisconnectEstablishmentWhatsappRequest): Promise<void> {
    const integration =
      await this.integrationRepository.findByEstablishmentId(establishmentId);

    if (!integration) throw new WhatsappIntegrationNotFound();

    await this.whatsappProvider.disconnectInstance({
      instanceName: integration.instance_name,
      instanceToken: integration.instance_token,
    });

    await this.integrationRepository.softDeleteByEstablishmentId(
      establishmentId,
    );
  }
}
