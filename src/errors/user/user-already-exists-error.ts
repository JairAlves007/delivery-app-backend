import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { ErrorBase } from "../error-base";

export class UserAlreadyExistsError extends ErrorBase {
	constructor() {
		super(
			"User already exists",
			HTTPStatusCodes.CONFLICT,
			"USER_ALREADY_EXISTS"
		);
	}
}
