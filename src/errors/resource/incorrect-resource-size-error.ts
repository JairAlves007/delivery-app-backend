import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class IncorrectResourceSize extends ErrorBase {
	constructor(sizeType: string) {
		super(
			`Resource ${sizeType} is incorrect`,
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"INCORRECT_RESOURCE_SIZE"
		);
	}
}
