import { CalculateCouponDiscountFromOrderService } from "@/services/order/validations/calculate-coupon-discount-from-order-service.ts";

export const makeCalculateCouponDiscountFromOrderService = () => {
	return new CalculateCouponDiscountFromOrderService();
};
