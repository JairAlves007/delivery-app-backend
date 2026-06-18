import { ValidateScheduledAtFromOrderService } from "@/services/order/validations/validate-scheduled-at-from-order-service.js";

export const makeValidateScheduledAtFromOrderService = () => {
  return new ValidateScheduledAtFromOrderService();
};
