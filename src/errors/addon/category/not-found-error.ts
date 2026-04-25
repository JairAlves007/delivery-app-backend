import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonCategoryNotFound extends ErrorBase {
  constructor() {
    super(
      "Addon category not found",
      HTTPStatusCodes.NOT_FOUND,
      "ADDON_CATEGORY_NOT_FOUND",
    );
  }
}
