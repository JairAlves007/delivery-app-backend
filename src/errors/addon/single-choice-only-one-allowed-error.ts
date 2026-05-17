import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class SingleChoiceOnlyOneAllowedError extends ErrorBase {
  constructor() {
    super(
      "SINGLE_CHOICE category allows exactly one addon",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "SINGLE_CHOICE_ONLY_ONE_ALLOWED",
    );
  }
}
