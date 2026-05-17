import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonCategoryRequiredError extends ErrorBase {
  constructor(categoryName?: string) {
    super(
      categoryName
        ? `Required addon category not provided: ${categoryName}`
        : "Required addon category not provided",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "ADDON_CATEGORY_REQUIRED",
    );
  }
}
