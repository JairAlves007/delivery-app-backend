import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class PasswordDoesNotMatch extends ErrorBase {
	constructor() {
		super(
			"Password does not match token",
			HTTPStatusCodes.NOT_FOUND,
			"PASSWORD_DOES_NOT_MATCH"
		);
	}
}
