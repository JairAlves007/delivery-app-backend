import { SendResetPasswordMailService } from "@/services/mail/send-reset-password-mail-service.ts";
import { makeMail } from "./make-mail.ts";

export const makeSendResetPasswordMailService = () => {
	const mail = makeMail();

	return new SendResetPasswordMailService(mail);
};
