import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { ValidateCombosFromOrderService } from "@/services/order/validations/validate-combo-from-order-service.js";

export const makeValidateCombosFromOrderService = () => {
  return new ValidateCombosFromOrderService(makeComboRepository());
};
