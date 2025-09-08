import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class InvalidEstablishment extends ErrorBase {
	constructor() {
		super(
			"Invalid establishment",
			HTTPStatusCodes.UNAUTHORIZED,
			"INVALID_ESTABLISHMENT"
		);
	}
}
