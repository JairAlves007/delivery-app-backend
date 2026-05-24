import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class WhatsAppIntegrationNotFound extends ErrorBase {
	constructor() {
		super(
			"WhatsApp integration not found",
			HTTPStatusCodes.NOT_FOUND,
			"WHATSAPP_INTEGRATION_NOT_FOUND"
		);
	}
}
