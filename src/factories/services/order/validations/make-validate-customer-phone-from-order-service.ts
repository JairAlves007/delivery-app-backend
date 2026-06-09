import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { ValidateCustomerPhoneFromOrderService } from "@/services/order/validations/validate-customer-phone-from-order-service.js";

export const makeValidateCustomerPhoneFromOrderService = () => {
  return new ValidateCustomerPhoneFromOrderService(
    makeEstablishmentWhatsappIntegrationRepository(),
    makeWhatsappProvider(),
    makeCache(),
  );
};
