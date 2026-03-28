import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class EstablishmentNotFound extends ErrorBase {
	constructor() {
		super(
			"Establishment not found",
			HTTPStatusCodes.NOT_FOUND,
			"ESTABLISHMENT_NOT_FOUND"
		);
	}
}
