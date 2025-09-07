import type { ValidationReason } from "@/types/coupon.ts";
import { ErrorBase } from "../error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class CouponErrorBase extends ErrorBase {
	constructor(message: string, reason: ValidationReason) {
		super(message, HTTPStatusCodes.BAD_REQUEST, reason);
	}
}
