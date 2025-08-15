import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class UserUnauthorized extends ErrorBase {
	constructor() {
		super(
			"User is unauthorized to perform this action",
			HTTPStatusCodes.UNAUTHORIZED,
			"UNAUTHORIZED"
		);
	}
}
