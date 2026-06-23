import { CouponErrorBase } from "./error-base.js";

export class CouponMinOrderNotReached extends CouponErrorBase {
  constructor() {
    super("Coupon minimum order value not reached", "MIN_ORDER_NOT_REACHED");
  }
}
