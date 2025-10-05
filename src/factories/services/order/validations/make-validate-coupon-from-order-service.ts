import { ValidateCouponFromOrderService } from "@/services/order/validations/validate-coupon-from-order-service.ts";

export const makeValidateCouponFromOrderService = () => {
	return new ValidateCouponFromOrderService();
};
