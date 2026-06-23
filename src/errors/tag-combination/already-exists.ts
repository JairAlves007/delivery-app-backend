import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class TagCombinationAlreadyExists extends ErrorBase {
  constructor() {
    super(
      "Tag combination already exists",
      HTTPStatusCodes.CONFLICT,
      "ALREADY_EXISTS",
    );
  }
}
