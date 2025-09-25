import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class InvalidToken extends ErrorBase {
	constructor() {
		super(
			"Token is invalid or expired",
			HTTPStatusCodes.NOT_FOUND,
			"INVALID_TOKEN"
		);
	}
}
