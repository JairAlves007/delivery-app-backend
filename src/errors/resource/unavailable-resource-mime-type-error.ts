import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class UnavailableResourceMimeType extends ErrorBase {
	constructor() {
		super(
			"Unavailable resource mime type",
			HTTPStatusCodes.UNPROCESSABLE_ENTITY,
			"UNAVAILABLE_RESOURCE_MIME_TYPE"
		);
	}
}
