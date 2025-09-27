import type { IMail } from "@/interfaces/mail/mail-base.ts";
import type { ResetPasswordMailData } from "@/types/mail.ts";

export class SendResetPasswordMailService {
	private mail: IMail;

	constructor(mail: IMail) {
		this.mail = mail;
	}

	async handle(data: ResetPasswordMailData) {
		await this.mail.sendResetPasswordMail(data);
	}
}
