import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class ComboInvalidSelection extends ErrorBase {
  constructor(message = "Invalid combo selection") {
    super(message, HTTPStatusCodes.BAD_REQUEST, "INVALID_SELECTION");
  }
}
