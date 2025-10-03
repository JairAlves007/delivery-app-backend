import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class AddressNotFound extends ErrorBase {
	constructor() {
		super("Address not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
