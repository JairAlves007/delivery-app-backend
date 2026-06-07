import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class PhoneWithoutWhatsapp extends ErrorBase {
  constructor() {
    super(
      "O número de telefone informado não possui WhatsApp",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "PHONE_WITHOUT_WHATSAPP",
    );
  }
}
