import type { Cache } from "@/classes/cache.js";
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
  private cache: Cache;

  constructor(
    integrationRepository: IEstablishmentWhatsappIntegrationRepository,
    whatsappProvider: IWhatsappProvider,
    cache: Cache,
  ) {
    this.integrationRepository = integrationRepository;
    this.whatsappProvider = whatsappProvider;
    this.cache = cache;
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

    await this.cache.forgetKeysContaining(
      `${this.cache.keys.whatsappNumberCheck}:${establishmentId}`,
    );
  }
}
