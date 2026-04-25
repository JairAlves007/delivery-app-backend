import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class BannerNotFound extends ErrorBase {
  constructor() {
    super("Banner not found", HTTPStatusCodes.NOT_FOUND, "BANNER_NOT_FOUND");
  }
}
