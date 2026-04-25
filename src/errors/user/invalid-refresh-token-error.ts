import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class InvalidRefreshToken extends ErrorBase {
  constructor() {
    super(
      "Invalid or expired refresh token",
      HTTPStatusCodes.UNAUTHORIZED,
      "INVALID_REFRESH_TOKEN",
    );
  }
}