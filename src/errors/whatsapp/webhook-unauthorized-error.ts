import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class WhatsAppWebhookUnauthorized extends ErrorBase {
	constructor(reason: string) {
		super(
			`WhatsApp webhook unauthorized: ${reason}`,
			HTTPStatusCodes.UNAUTHORIZED,
			"WHATSAPP_WEBHOOK_UNAUTHORIZED"
		);
	}
}
