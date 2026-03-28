import type { IMail } from "@/interfaces/mail/mail-base.js";
import type { ResetPasswordMailData } from "@/types/mail.js";

export class SendResetPasswordMailService {
	private mail: IMail;

	constructor(mail: IMail) {
		this.mail = mail;
	}

	async handle(data: ResetPasswordMailData) {
		await this.mail.sendResetPasswordMail(data);
	}
}
