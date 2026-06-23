import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class ComboUnavailable extends ErrorBase {
  constructor() {
    super("Combo is unavailable", HTTPStatusCodes.BAD_REQUEST, "UNAVAILABLE");
  }
}
