import { ValidateCouponFromOrderService } from "@/services/order/validations/validate-coupon-from-order-service.js";

export const makeValidateCouponFromOrderService = () => {
  return new ValidateCouponFromOrderService();
};
