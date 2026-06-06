import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class InvalidDigitalMenuFile extends ErrorBase {
  constructor(message = "Arquivo de cardápio inválido") {
    super(
      message,
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "INVALID_DIGITAL_MENU_FILE",
    );
  }
}
