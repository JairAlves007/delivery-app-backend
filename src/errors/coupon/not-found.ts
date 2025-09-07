import { CouponErrorBase } from "./error-base.ts";

export class CouponNotFound extends CouponErrorBase {
	constructor() {
		super("Coupon not found", "NOT_FOUND");
	}
}
