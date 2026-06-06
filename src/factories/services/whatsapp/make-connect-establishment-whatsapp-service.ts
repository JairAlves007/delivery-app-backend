import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { ConnectEstablishmentWhatsappService } from "@/services/whatsapp/connect-establishment-whatsapp-service.js";

export const makeConnectEstablishmentWhatsappService = () => {
  const integrationRepository =
    makeEstablishmentWhatsappIntegrationRepository();
  const whatsappProvider = makeWhatsappProvider();

  return new ConnectEstablishmentWhatsappService(
    integrationRepository,
    whatsappProvider,
  );
};
