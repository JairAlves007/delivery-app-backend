import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class WhatsappIntegrationNotFound extends ErrorBase {
  constructor() {
    super(
      "Integração de WhatsApp não encontrada",
      HTTPStatusCodes.NOT_FOUND,
      "WHATSAPP_INTEGRATION_NOT_FOUND",
    );
  }
}
