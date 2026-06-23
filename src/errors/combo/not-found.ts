import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class ComboNotFound extends ErrorBase {
  constructor() {
    super("Combo not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
  }
}
