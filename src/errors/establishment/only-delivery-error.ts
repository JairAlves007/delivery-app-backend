import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class EstablishmentIsOnlyDeliveryError extends ErrorBase {
	constructor() {
		super(
			"Establishment is only delivery",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_IS_ONLY_DELIVERY"
		);
	}
}
