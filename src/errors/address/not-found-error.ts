import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class AddressNotFound extends ErrorBase {
  constructor() {
    super("Address not found", HTTPStatusCodes.NOT_FOUND, "ADDRESS_NOT_FOUND");
  }
}
