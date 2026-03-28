import { ResetPasswordMailData } from "@/types/mail.js";

export interface IMail {
	sendResetPasswordMail(data: ResetPasswordMailData): Promise<void>;
}
