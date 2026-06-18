import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class OrderSchedulingError extends ErrorBase {
  constructor(message: string) {
    super(message, HTTPStatusCodes.UNPROCESSABLE_ENTITY, "ORDER_SCHEDULING_ERROR");
  }
}
