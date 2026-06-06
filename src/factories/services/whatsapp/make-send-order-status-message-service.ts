import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { makeWhatsappMessageLogRepository } from "@/factories/repositories/make-whatsapp-message-log-repository.js";
import { SendOrderStatusMessageService } from "@/services/whatsapp/send-order-status-message-service.js";

export const makeSendOrderStatusMessageService = () => {
  const integrationRepository =
    makeEstablishmentWhatsappIntegrationRepository();
  const templateRepository = makeOrderStatusMessageTemplateRepository();
  const messageLogRepository = makeWhatsappMessageLogRepository();
  const establishmentRepository = makeEstablishmentRepository();
  const whatsappProvider = makeWhatsappProvider();

  return new SendOrderStatusMessageService(
    integrationRepository,
    templateRepository,
    messageLogRepository,
    establishmentRepository,
    whatsappProvider,
  );
};
