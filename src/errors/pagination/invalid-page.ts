import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidPage extends ErrorBase {
  constructor() {
    super("Invalid page provided", HTTPStatusCodes.BAD_REQUEST, "INVALID_PAGE");
  }
}
