import { SendOrderConfirmationMessageService } from "@/services/order/send-order-confirmation-message-service.ts";

export const makeSendOrderConfirmationMessageService = () => {
	return new SendOrderConfirmationMessageService();
};
