import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class EstablishmentDoesNotAcceptCardError extends ErrorBase {
	constructor() {
		super(
			"Establishment does not accept card",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_DOES_NOT_ACCEPT_CARD"
		);
	}
}
