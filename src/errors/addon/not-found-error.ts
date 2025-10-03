import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class AddonNotFound extends ErrorBase {
	constructor() {
		super("Addon not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
