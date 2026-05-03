import { join, resolve } from "node:path";

import { renderFile } from "ejs";

import { FailedToSendMail } from "@/errors/mail/failed-to-send-mail-error.js";
import type { IMail } from "@/interfaces/mail/mail-base.js";
import { mailTransporter } from "@/lib/mail.js";
import type { ResetPasswordMailData } from "@/types/mail.js";

export class Mail implements IMail {
  private static instance: Mail | null = null;
  private readonly TEMPLATES_PATH: string = resolve(
    process.cwd(),
    "src",
    "mails",
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
    const resetPasswordMail = join(
      this.TEMPLATES_PATH,
      "reset-password-mail.ejs",
    );

    const html = await renderFile(resetPasswordMail, data);

    try {
      await mailTransporter.sendMail({
        from,
        subject: "Recuperação de senha",
        to,
        html,
      });
    } catch (error) {
      console.error(error);
      throw new FailedToSendMail("Reset Password");
    }
  }
}
