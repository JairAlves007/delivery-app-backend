import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class ProductOutOfStockError extends ErrorBase {
	constructor() {
		super(
			"Product out of stock",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"PRODUCT_OUT_OF_STOCK_ERROR"
		);
	}
}
