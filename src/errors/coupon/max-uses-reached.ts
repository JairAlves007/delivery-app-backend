import { CouponErrorBase } from "./error-base.js";

export class CouponMaxUsesReached extends CouponErrorBase {
  constructor() {
    super("Coupon max uses reached", "MAX_USES_REACHED");
  }
}
