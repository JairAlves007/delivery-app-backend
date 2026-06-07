import { PhoneWithoutWhatsapp } from "@/errors/whatsapp/phone-without-whatsapp.js";
import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
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

  constructor(
    whatsappIntegrationRepository: IEstablishmentWhatsappIntegrationRepository,
    whatsappProvider: IWhatsappProvider,
  ) {
    this.whatsappIntegrationRepository = whatsappIntegrationRepository;
    this.whatsappProvider = whatsappProvider;
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

    let exists: boolean;

    try {
      const result = await this.whatsappProvider.checkNumberHasWhatsapp({
        instanceName: integration.instance_name,
        instanceToken: integration.instance_token,
        number,
      });

      exists = result.exists;
    } catch {
      return;
    }

    if (!exists) throw new PhoneWithoutWhatsapp();
  }
}
