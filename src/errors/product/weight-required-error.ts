import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ProductWeightRequiredError extends ErrorBase {
  constructor() {
    super(
      "weight_grams is required for PER_WEIGHT products",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "PRODUCT_WEIGHT_REQUIRED",
    );
  }
}
