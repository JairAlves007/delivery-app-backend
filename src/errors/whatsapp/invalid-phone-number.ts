import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class InvalidPhoneNumber extends ErrorBase {
  constructor() {
    super(
      "Número de telefone inválido",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "INVALID_PHONE_NUMBER",
    );
  }
}
