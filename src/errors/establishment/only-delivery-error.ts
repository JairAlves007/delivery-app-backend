import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class EstablishmentIsOnlyDeliveryError extends ErrorBase {
	constructor() {
		super(
			"Establishment is only delivery",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_IS_ONLY_DELIVERY"
		);
	}
}
