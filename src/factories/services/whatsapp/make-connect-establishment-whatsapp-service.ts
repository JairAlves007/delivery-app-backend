import { makeWhatsAppProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsAppIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { ConnectEstablishmentWhatsAppService } from "@/services/whatsapp/connect-establishment-whatsapp-service.js";

export const makeConnectEstablishmentWhatsAppService = () => {
	return new ConnectEstablishmentWhatsAppService(
		makeEstablishmentWhatsAppIntegrationRepository(),
		makeWhatsAppProvider()
	);
};
