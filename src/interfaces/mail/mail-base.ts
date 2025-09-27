import { ResetPasswordMailData } from "@/types/mail.ts";

export interface IMail {
	sendResetPasswordMail(data: ResetPasswordMailData): Promise<void>;
}
