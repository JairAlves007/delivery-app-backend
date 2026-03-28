import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class OrderNotFound extends ErrorBase {
	constructor() {
		super("Order not found", HTTPStatusCodes.NOT_FOUND, "ORDER_NOT_FOUND");
	}
}
