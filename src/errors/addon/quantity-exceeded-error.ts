import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonQuantityExceeded extends ErrorBase {
	constructor() {
		super(
			"Addon quantity exceeded",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"ADDON_QUANTITY_EXCEEDED"
		);
	}
}
