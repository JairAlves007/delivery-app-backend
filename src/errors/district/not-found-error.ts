import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class DistrictNotFound extends ErrorBase {
	constructor() {
		super("District not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
