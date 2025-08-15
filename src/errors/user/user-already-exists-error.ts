import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class UserAlreadyExistsError extends ErrorBase {
	constructor() {
		super(
			"User already exists",
			HTTPStatusCodes.CONFLICT,
			"USER_ALREADY_EXISTS"
		);
	}
}
