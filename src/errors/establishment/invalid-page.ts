import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class InvalidPage extends ErrorBase {
	constructor() {
		super("Invalid page provided", HTTPStatusCodes.BAD_REQUEST, "INVALID_PAGE");
	}
}
