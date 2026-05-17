import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonCategoryNotLinkedToProductError extends ErrorBase {
  constructor() {
    super(
      "Addon category not linked to this product",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "ADDON_CATEGORY_NOT_LINKED_TO_PRODUCT",
    );
  }
}
