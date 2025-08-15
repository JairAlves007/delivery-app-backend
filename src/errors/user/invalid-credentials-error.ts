import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class InvalidCredentials extends ErrorBase {
	constructor() {
		super(
			"Invalid credentials provided",
			HTTPStatusCodes.UNAUTHORIZED,
			"INVALID_CREDENTIALS"
		);
	}
}
