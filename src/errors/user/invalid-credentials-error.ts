import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidCredentials extends ErrorBase {
	constructor() {
		super(
			"Invalid credentials provided",
			HTTPStatusCodes.UNAUTHORIZED,
			"INVALID_CREDENTIALS"
		);
	}
}
