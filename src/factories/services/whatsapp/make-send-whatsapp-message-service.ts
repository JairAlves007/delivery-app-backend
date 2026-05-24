import { makeWhatsAppProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsAppIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { makeWhatsAppMessageLogRepository } from "@/factories/repositories/make-whatsapp-message-log-repository.js";
import { SendWhatsAppMessageService } from "@/services/whatsapp/send-whatsapp-message-service.js";

export const makeSendWhatsAppMessageService = () => {
	return new SendWhatsAppMessageService(
		makeEstablishmentWhatsAppIntegrationRepository(),
		makeOrderStatusMessageTemplateRepository(),
		makeWhatsAppMessageLogRepository(),
		makeWhatsAppProvider()
	);
};
