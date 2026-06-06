import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class WhatsappTemplateNotFound extends ErrorBase {
  constructor() {
    super(
      "Template de mensagem não encontrado",
      HTTPStatusCodes.NOT_FOUND,
      "WHATSAPP_TEMPLATE_NOT_FOUND",
    );
  }
}
