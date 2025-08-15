import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class UserUnauthenticated extends ErrorBase {
	constructor() {
		super(
			"User is not authenticated",
			HTTPStatusCodes.UNAUTHORIZED,
			"UNAUTHENTICATED"
		);
	}
}
