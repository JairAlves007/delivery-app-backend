import { ValidateProductFromOrderService } from "@/services/order/validations/validate-product-from-order-service.js";

export const makeValidateProductFromOrderService = () => {
	return new ValidateProductFromOrderService();
};
