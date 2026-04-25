import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class UserUnauthenticated extends ErrorBase {
  constructor() {
    super(
      "User is not authenticated",
      HTTPStatusCodes.UNAUTHORIZED,
      "UNAUTHENTICATED",
    );
  }
}
