import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class UserUnauthorized extends ErrorBase {
  constructor() {
    super(
      "User is unauthorized to perform this action",
      HTTPStatusCodes.UNAUTHORIZED,
      "UNAUTHORIZED",
    );
  }
}
