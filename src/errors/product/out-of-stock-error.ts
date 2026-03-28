import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ProductOutOfStockError extends ErrorBase {
	constructor() {
		super(
			"Product out of stock",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"PRODUCT_OUT_OF_STOCK_ERROR"
		);
	}
}
