import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class OrderStatusMessageTemplateNotFound extends ErrorBase {
	constructor() {
		super(
			"Order status message template not found",
			HTTPStatusCodes.NOT_FOUND,
			"ORDER_STATUS_MESSAGE_TEMPLATE_NOT_FOUND"
		);
	}
}
