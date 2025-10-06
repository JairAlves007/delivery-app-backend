import { ValidateAddonsFromOrderService } from "@/services/order/validations/validate-addons-from-order-service.ts";

export const makeValidateAddonsFromOrderService = () => {
	return new ValidateAddonsFromOrderService();
};
