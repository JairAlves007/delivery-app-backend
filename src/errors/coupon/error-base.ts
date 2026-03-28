import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import type { ValidationReason } from "@/types/coupon.js";

import { ErrorBase } from "../error-base.js";

export class CouponErrorBase extends ErrorBase {
	constructor(message: string, reason: ValidationReason) {
		super(message, HTTPStatusCodes.BAD_REQUEST, reason);
	}
}
