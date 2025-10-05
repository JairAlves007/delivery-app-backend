import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class EstablishmentIsClosed extends ErrorBase {
	constructor() {
		super(
			"Establishment is closed right now",
			HTTPStatusCodes.UNAUTHORIZED,
			"ESTABLISHMENT_IS_CLOSED"
		);
	}
}
