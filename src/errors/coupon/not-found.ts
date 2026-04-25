import { CouponErrorBase } from "./error-base.js";

export class CouponNotFound extends CouponErrorBase {
  constructor() {
    super("Coupon not found", "NOT_FOUND");
  }
}
