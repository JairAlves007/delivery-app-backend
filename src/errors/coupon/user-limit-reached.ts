import { CouponErrorBase } from "./error-base.js";

export class CouponUserLimitReached extends CouponErrorBase {
  constructor() {
    super("Coupon user limit reached", "USER_LIMIT_REACHED");
  }
}
