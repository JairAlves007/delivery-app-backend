import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class ServiceUnavailable extends ErrorBase {
  constructor(message = "Serviço indisponível") {
    super(
      message,
      HTTPStatusCodes.SERVICE_UNAVAILABLE,
      "SERVICE_UNAVAILABLE",
    );
  }
}
