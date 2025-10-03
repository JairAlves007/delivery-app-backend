import { ErrorBase } from "@/errors/error-base.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";

export class BannerNotFound extends ErrorBase {
	constructor() {
		super("Banner not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
	}
}
