import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class WhatsappNotConnected extends ErrorBase {
  constructor() {
    super(
      "O WhatsApp do estabelecimento não está conectado",
      HTTPStatusCodes.CONFLICT,
      "WHATSAPP_NOT_CONNECTED",
    );
  }
}
