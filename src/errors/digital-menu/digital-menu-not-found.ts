import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class DigitalMenuNotFound extends ErrorBase {
  constructor(message = "Cardápio digital não encontrado") {
    super(message, HTTPStatusCodes.NOT_FOUND, "DIGITAL_MENU_NOT_FOUND");
  }
}
