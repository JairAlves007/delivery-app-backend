import { CouponErrorBase } from "./error-base.js";

export class CouponInactive extends CouponErrorBase {
  constructor() {
    super("Coupon is inactive", "INACTIVE");
  }
}
