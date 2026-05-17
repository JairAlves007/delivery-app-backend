import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ProductQuantityNotAllowedForWeightedError extends ErrorBase {
  constructor() {
    super(
      "quantity must be 1 for PER_WEIGHT products",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "PRODUCT_QUANTITY_NOT_ALLOWED_FOR_WEIGHTED",
    );
  }
}
