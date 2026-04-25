import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ProductNotFound extends ErrorBase {
  constructor() {
    super("Product not found", HTTPStatusCodes.NOT_FOUND, "PRODUCT_NOT_FOUND");
  }
}
