import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { ErrorBase } from "../error-base.ts";

export class UnavailableResourceMimeType extends ErrorBase {
	constructor() {
		super(
			"Unavailable resource mime type",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"UNAVAILABLE_RESOURCE_MIME_TYPE"
		);
	}
}
