import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class ProductCategoryNotFound extends ErrorBase {
	constructor() {
		super(
			"Product Category not found",
			HTTPStatusCodes.NOT_FOUND,
			"PRODUCT_CATEGORY_NOT_FOUND"
		);
	}
}
