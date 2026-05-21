import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class ResourceNotFound extends ErrorBase {
  constructor() {
    super(
      "Recurso não encontrado",
      HTTPStatusCodes.NOT_FOUND,
      "RESOURCE_NOT_FOUND",
    );
  }
}
