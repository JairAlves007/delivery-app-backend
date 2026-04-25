import { SendResetPasswordMailService } from "@/services/mail/send-reset-password-mail-service.js";

import { makeMail } from "./make-mail.js";

export const makeSendResetPasswordMailService = () => {
  const mail = makeMail();

  return new SendResetPasswordMailService(mail);
};
