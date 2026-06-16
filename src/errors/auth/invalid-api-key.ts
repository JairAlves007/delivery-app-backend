import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidApiKey extends ErrorBase {
  constructor() {
    super(
      "Invalid or missing API key",
      HTTPStatusCodes.UNAUTHORIZED,
      "INVALID_API_KEY",
    );
  }
}
