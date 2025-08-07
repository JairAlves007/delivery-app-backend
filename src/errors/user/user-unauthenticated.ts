import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { ErrorBase } from "../error-base";

export class UserUnauthenticated extends ErrorBase {
	constructor() {
		super(
			"User is not authenticated",
			HTTPStatusCodes.UNAUTHORIZED,
			"UNAUTHENTICATED"
		);
	}
}
