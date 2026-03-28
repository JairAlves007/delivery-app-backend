import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class InvalidToken extends ErrorBase {
	constructor() {
		super(
			"Token is invalid or expired",
			HTTPStatusCodes.NOT_FOUND,
			"INVALID_TOKEN"
		);
	}
}
