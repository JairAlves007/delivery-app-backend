import { makeEstablishmentWhatsAppIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { FindEstablishmentWhatsAppIntegrationService } from "@/services/whatsapp/find-establishment-whatsapp-integration-service.js";

export const makeFindEstablishmentWhatsAppIntegrationService = () => {
	return new FindEstablishmentWhatsAppIntegrationService(
		makeEstablishmentWhatsAppIntegrationRepository()
	);
};
