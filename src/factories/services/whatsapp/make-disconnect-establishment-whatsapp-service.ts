import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { DisconnectEstablishmentWhatsappService } from "@/services/whatsapp/disconnect-establishment-whatsapp-service.js";

export const makeDisconnectEstablishmentWhatsappService = () => {
  const integrationRepository =
    makeEstablishmentWhatsappIntegrationRepository();
  const whatsappProvider = makeWhatsappProvider();

  return new DisconnectEstablishmentWhatsappService(
    integrationRepository,
    whatsappProvider,
  );
};
