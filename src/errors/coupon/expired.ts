import { CouponErrorBase } from "./error-base.js";

export class CouponExpired extends CouponErrorBase {
	constructor() {
		super("Coupon expired", "EXPIRED");
	}
}
