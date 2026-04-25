import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

import { ErrorBase } from "../error-base.js";

export class FailedToSendMail extends ErrorBase {
  constructor(mail: string) {
    super(
      `Failed to send ${mail} mail`,
      HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      `FAILED_TO_SEND_${mail.toUpperCase().replaceAll(" ", "_")}_MAIL`,
    );
  }
}
