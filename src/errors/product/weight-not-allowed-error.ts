import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ProductWeightNotAllowedError extends ErrorBase {
  constructor() {
    super(
      "weight_grams not allowed for UNIT products",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "PRODUCT_WEIGHT_NOT_ALLOWED",
    );
  }
}
