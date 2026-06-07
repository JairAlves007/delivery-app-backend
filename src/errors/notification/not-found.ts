import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class NotificationNotFound extends ErrorBase {
  constructor() {
    super(
      "Notification not found",
      HTTPStatusCodes.NOT_FOUND,
      "NOTIFICATION_NOT_FOUND",
    );
  }
}
