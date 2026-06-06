import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class WhatsappWebhookUnauthorized extends ErrorBase {
  constructor() {
    super(
      "Webhook do WhatsApp não autorizado",
      HTTPStatusCodes.UNAUTHORIZED,
      "WHATSAPP_WEBHOOK_UNAUTHORIZED",
    );
  }
}
