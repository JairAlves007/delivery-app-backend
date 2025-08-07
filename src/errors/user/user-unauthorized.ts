import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { ErrorBase } from "../error-base";

export class UserUnauthorized extends ErrorBase {
	constructor() {
		super(
			"User is unauthorized to perform this action",
			HTTPStatusCodes.UNAUTHORIZED,
			"UNAUTHORIZED"
		);
	}
}
