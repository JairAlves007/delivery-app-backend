import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class ProductNotFound extends ErrorBase {
	constructor() {
		super("Product not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
