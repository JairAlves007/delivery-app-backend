import { ValidateEstablishmentFromOrderService } from "@/services/order/validations/validate-establishment-from-order-service.ts";

export const makeValidateEstablishmentFromOrderService = () => {
	return new ValidateEstablishmentFromOrderService();
};
