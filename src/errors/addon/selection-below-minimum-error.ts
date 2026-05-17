import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonSelectionBelowMinimumError extends ErrorBase {
  constructor() {
    super(
      "Addon selection below minimum",
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
      "ADDON_SELECTION_BELOW_MINIMUM",
    );
  }
}
