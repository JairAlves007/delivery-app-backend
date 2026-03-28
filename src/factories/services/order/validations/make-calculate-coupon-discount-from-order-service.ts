import { CalculateCouponDiscountFromOrderService } from "@/services/order/validations/calculate-coupon-discount-from-order-service.js";

export const makeCalculateCouponDiscountFromOrderService = () => {
	return new CalculateCouponDiscountFromOrderService();
};
