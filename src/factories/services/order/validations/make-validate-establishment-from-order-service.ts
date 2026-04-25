import { ValidateEstablishmentFromOrderService } from "@/services/order/validations/validate-establishment-from-order-service.js";

export const makeValidateEstablishmentFromOrderService = () => {
  return new ValidateEstablishmentFromOrderService();
};
