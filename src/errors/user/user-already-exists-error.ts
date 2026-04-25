import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class UserAlreadyExistsError extends ErrorBase {
  constructor() {
    super(
      "User already exists",
      HTTPStatusCodes.CONFLICT,
      "USER_ALREADY_EXISTS",
    );
  }
}
