import { ValidateDeliveryFromOrderService } from "@/services/order/validations/validate-delivery-from-order-service.js";

export const makeValidateDeliveryFromOrderService = () => {
  return new ValidateDeliveryFromOrderService();
};
