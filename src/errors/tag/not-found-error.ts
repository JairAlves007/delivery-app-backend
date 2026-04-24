import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class TagNotFound extends ErrorBase {
	constructor() {
		super("Tag not found", HTTPStatusCodes.NOT_FOUND, "TAG_NOT_FOUND");
	}
}
