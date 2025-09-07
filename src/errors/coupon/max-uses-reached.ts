import { CouponErrorBase } from "./error-base.ts";

export class CouponMaxUsesReached extends CouponErrorBase {
	constructor() {
		super("Coupon max uses reached", "MAX_USES_REACHED");
	}
}
