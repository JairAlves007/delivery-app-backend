import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class InvalidResource extends ErrorBase {
	constructor() {
		super(
			"Resource is invalid",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"INVALID_RESOURCE"
		);
	}
}
