import { ValidateAddonCategoriesFromOrderService } from "@/services/order/validations/validate-addon-categories-from-order-service.js";

export const makeValidateAddonCategoriesFromOrderService = () => {
  return new ValidateAddonCategoriesFromOrderService();
};
