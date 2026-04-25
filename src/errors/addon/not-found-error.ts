import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddonNotFound extends ErrorBase {
  constructor() {
    super("Addon not found", HTTPStatusCodes.NOT_FOUND, "ADDON_NOT_FOUND");
  }
}
