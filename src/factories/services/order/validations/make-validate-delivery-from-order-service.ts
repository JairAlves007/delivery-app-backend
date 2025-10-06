import { ValidateDeliveryFromOrderService } from "@/services/order/validations/validate-delivery-from-order-service.ts";

export const makeValidateDeliveryFromOrderService = () => {
	return new ValidateDeliveryFromOrderService();
};
