import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class WhatsAppProviderError extends ErrorBase {
	constructor(message: string) {
		super(
			`WhatsApp provider error: ${message}`,
			HTTPStatusCodes.BAD_GATEWAY,
			"WHATSAPP_PROVIDER_ERROR"
		);
	}
}
