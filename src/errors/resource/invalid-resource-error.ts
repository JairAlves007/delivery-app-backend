import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidResource extends ErrorBase {
  constructor() {
    super(
      "Resource is invalid",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "INVALID_RESOURCE",
    );
  }
}
