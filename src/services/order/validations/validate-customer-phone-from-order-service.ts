import type { Cache } from "@/classes/cache.js";
import { PhoneWithoutWhatsapp } from "@/errors/whatsapp/phone-without-whatsapp.js";
import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { normalizeToBrazilianJid } from "@/helpers/phone.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ValidateCustomerPhoneFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  customerPhone: string;
};

export class ValidateCustomerPhoneFromOrderService {
  private whatsappIntegrationRepository: IEstablishmentWhatsappIntegrationRepository;
  private whatsappProvider: IWhatsappProvider;
  private cache: Cache;

  constructor(
    whatsappIntegrationRepository: IEstablishmentWhatsappIntegrationRepository,
    whatsappProvider: IWhatsappProvider,
    cache: Cache,
  ) {
    this.whatsappIntegrationRepository = whatsappIntegrationRepository;
    this.whatsappProvider = whatsappProvider;
    this.cache = cache;
  }

  async handle({
    establishmentId,
    customerPhone,
  }: ValidateCustomerPhoneFromOrderServiceRequest): Promise<void> {
    const number = normalizeToBrazilianJid(customerPhone);

    const integration =
      await this.whatsappIntegrationRepository.findByEstablishmentId(
        establishmentId,
      );

    if (!integration || integration.status !== WhatsappConnectionStatus.CONNECTED)
      return;

    const cacheKey = `${this.cache.keys.whatsappNumberCheck}:${establishmentId}:${number}`;

    const exists = await this.cache.remember(
      cacheKey,
      Constants.CACHE_TTL.whatsappNumberCheck,
      async () => {
        const result = await this.whatsappProvider.checkNumberHasWhatsapp({
          instanceName: integration.instance_name,
          instanceToken: integration.instance_token,
          number,
        });

        return result.exists;
      },
      { domain: "whatsappNumberCheck", establishmentId },
    );

    if (!exists) throw new PhoneWithoutWhatsapp();
  }
}
