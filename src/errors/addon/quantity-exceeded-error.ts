import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class AddonQuantityExceeded extends ErrorBase {
	constructor() {
		super(
			"Addon quantity exceeded",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"ADDON_QUANTITY_EXCEEDED"
		);
	}
}
