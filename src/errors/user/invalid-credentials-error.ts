import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { ErrorBase } from "../error-base";

export class InvalidCredentials extends ErrorBase {
	constructor() {
		super(
			"Invalid credentials provided",
			HTTPStatusCodes.UNAUTHORIZED,
			"INVALID_CREDENTIALS"
		);
	}
}
