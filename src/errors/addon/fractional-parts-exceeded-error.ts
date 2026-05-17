import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class FractionalPartsExceededError extends ErrorBase {
  constructor() {
    super(
      "Fractional parts count exceeded",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "FRACTIONAL_PARTS_EXCEEDED",
    );
  }
}
