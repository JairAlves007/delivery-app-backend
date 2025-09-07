import { CouponErrorBase } from "./error-base.ts";

export class CouponUserLimitReached extends CouponErrorBase {
	constructor() {
		super("Coupon user limit reached", "USER_LIMIT_REACHED");
	}
}
