import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class DistrictNotFound extends ErrorBase {
	constructor() {
		super(
			"District not found",
			HTTPStatusCodes.NOT_FOUND,
			"DISTRICT_NOT_FOUND"
		);
	}
}
