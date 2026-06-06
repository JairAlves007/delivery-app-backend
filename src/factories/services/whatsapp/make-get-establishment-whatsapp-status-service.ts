import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { GetEstablishmentWhatsappStatusService } from "@/services/whatsapp/get-establishment-whatsapp-status-service.js";

export const makeGetEstablishmentWhatsappStatusService = () => {
  const integrationRepository =
    makeEstablishmentWhatsappIntegrationRepository();
  const whatsappProvider = makeWhatsappProvider();

  return new GetEstablishmentWhatsappStatusService(
    integrationRepository,
    whatsappProvider,
  );
};
