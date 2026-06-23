import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class TagCombinationInvalidTags extends ErrorBase {
  constructor() {
    super(
      "Tags do not belong to establishment",
      HTTPStatusCodes.BAD_REQUEST,
      "INVALID_TAGS",
    );
  }
}
