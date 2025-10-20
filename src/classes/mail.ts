import { FailedToSendMail } from "@/errors/mail/failed-to-send-mail-error.ts";
import type { IMail } from "@/interfaces/mail/mail-base.ts";
import { mail } from "@/lib/mail.ts";
import type { ResetPasswordMailData } from "@/types/mail.ts";
import { renderFile } from "ejs";
import { join, resolve } from "node:path";

export class Mail implements IMail {
	private static instance: Mail | null = null;
	private readonly TEMPLATES_PATH: string = resolve(
		process.cwd(),
		"src",
		"mails"
	);

	static getInstance() {
		if (!this.instance) this.instance = new Mail();

		return this.instance;
	}

	async sendResetPasswordMail({
		from,
		to,
		...data
	}: ResetPasswordMailData): Promise<void> {
		try {
			const resetPasswordMail = join(
				this.TEMPLATES_PATH,
				"reset-password-mail.ejs"
			);

			const html = await renderFile(resetPasswordMail, data);

			const { error } = await mail.emails.send({
				from,
				subject: "Recuperação de senha",
				to: "ajair2550@gmail.com",
				html
			});

			if (!error) return;

			console.error(error);
			throw new FailedToSendMail("Reset Password");
		} catch (error) {
			throw error;
		}
	}
}
