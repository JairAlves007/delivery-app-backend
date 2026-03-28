import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class CancelOrderNotAllowed extends ErrorBase {
	constructor() {
		super(
			"We cannot cancel this order",
			HTTPStatusCodes.BAD_REQUEST,
			"CANCEL_ORDER_NOT_ALLOWED"
		);
	}
}
