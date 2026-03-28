import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class EstablishmentIsClosed extends ErrorBase {
	constructor() {
		super(
			"Establishment is closed right now",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_IS_CLOSED"
		);
	}
}
