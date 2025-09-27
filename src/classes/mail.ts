import { FailedToSendMail } from "@/errors/mail/failed-to-send-mail-error.ts";
import { mail } from "@/lib/mail.ts";
import { renderFile } from "ejs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import type { IMail } from "@/interfaces/mail/mail-base.ts";
import type { ResetPasswordMailData } from "@/types/mail.ts";

export class Mail implements IMail {
	private static instance: Mail | null = null;
	private readonly MODULE_DIR: string = dirname(fileURLToPath(import.meta.url));
	private readonly TEMPLATES_PATH: string = join(
		this.MODULE_DIR,
		"..",
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
				to,
				html
			});

			if (error) {
				console.error(error);
				throw new FailedToSendMail("Reset Password");
			}
		} catch (error) {
			throw error;
		}
	}
}
