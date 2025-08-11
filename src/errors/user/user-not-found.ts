import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { ErrorBase } from "../error-base";

export class UserNotFound extends ErrorBase {
	constructor() {
		super("User Not Found", HTTPStatusCodes.NOT_FOUND, "USER_NOT_FOUND");
	}
}
