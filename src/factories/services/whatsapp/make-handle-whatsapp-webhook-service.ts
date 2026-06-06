import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { makeWhatsappMessageLogRepository } from "@/factories/repositories/make-whatsapp-message-log-repository.js";
import { HandleWhatsappWebhookService } from "@/services/whatsapp/handle-whatsapp-webhook-service.js";

export const makeHandleWhatsappWebhookService = () => {
  const integrationRepository =
    makeEstablishmentWhatsappIntegrationRepository();
  const messageLogRepository = makeWhatsappMessageLogRepository();

  return new HandleWhatsappWebhookService(
    integrationRepository,
    messageLogRepository,
  );
};
