import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class EstablishmentDoesNotAcceptCardError extends ErrorBase {
	constructor() {
		super(
			"Establishment does not accept card",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_DOES_NOT_ACCEPT_CARD"
		);
	}
}
