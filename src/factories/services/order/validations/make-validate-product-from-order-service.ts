import { ValidateProductFromOrderService } from "@/services/order/validations/validate-product-from-order-service.ts";

export const makeValidateProductFromOrderService = () => {
	return new ValidateProductFromOrderService();
};
