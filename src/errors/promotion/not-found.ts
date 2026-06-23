import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class PromotionNotFound extends ErrorBase {
  constructor() {
    super("Promotion not found", HTTPStatusCodes.NOT_FOUND, "NOT_FOUND");
  }
}
