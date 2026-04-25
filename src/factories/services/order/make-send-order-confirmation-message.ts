import { SendOrderConfirmationMessageService } from "@/services/order/send-order-confirmation-message-service.js";

export const makeSendOrderConfirmationMessageService = () => {
  return new SendOrderConfirmationMessageService();
};
