import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidEstablishment extends ErrorBase {
	constructor() {
		super(
			"Invalid establishment",
			HTTPStatusCodes.UNAUTHORIZED,
			"INVALID_ESTABLISHMENT"
		);
	}
}
