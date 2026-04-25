import { ValidateAddonsFromOrderService } from "@/services/order/validations/validate-addons-from-order-service.js";

export const makeValidateAddonsFromOrderService = () => {
  return new ValidateAddonsFromOrderService();
};
