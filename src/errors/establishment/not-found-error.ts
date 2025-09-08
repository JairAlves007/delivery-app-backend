import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class EstablishmentNotFound extends ErrorBase {
	constructor() {
		super(
			"Establishment not found",
			HTTPStatusCodes.NOT_FOUND,
			"ESTABLISHMENT_NOT_FOUND"
		);
	}
}
