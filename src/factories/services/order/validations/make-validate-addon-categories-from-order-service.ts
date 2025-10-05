import { ValidateAddonCategoriesFromOrderService } from "@/services/order/validations/validate-addon-categories-from-order-service.ts";

export const makeValidateAddonCategoriesFromOrderService = () => {
	return new ValidateAddonCategoriesFromOrderService();
};
