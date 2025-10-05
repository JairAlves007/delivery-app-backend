import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class OrderNotFound extends ErrorBase {
	constructor() {
		super("Order not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
