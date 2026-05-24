import { makeWhatsAppProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsAppIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { DisconnectEstablishmentWhatsAppService } from "@/services/whatsapp/disconnect-establishment-whatsapp-service.js";

export const makeDisconnectEstablishmentWhatsAppService = () => {
	return new DisconnectEstablishmentWhatsAppService(
		makeEstablishmentWhatsAppIntegrationRepository(),
		makeWhatsAppProvider()
	);
};
