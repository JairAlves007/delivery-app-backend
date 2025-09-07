import { CouponErrorBase } from "./error-base.ts";

export class CouponExpired extends CouponErrorBase {
	constructor() {
		super("Coupon expired", "EXPIRED");
	}
}
