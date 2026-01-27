import {
	sendResetPasswordMailEvent,
	type SendResetPasswordMailEventType
} from "@/events/send-reset-password-mail-event.ts";
import { makeSendResetPasswordMailService } from "@/factories/services/mail/make-send-reset-password-mail-service.ts";

sendResetPasswordMailEvent.on(
	"send-reset-password-mail",
	async (payload: SendResetPasswordMailEventType) => {
		console.log("[Event] Sending reset password mail", payload);

		const sendResetPasswordMailService = makeSendResetPasswordMailService();

		await sendResetPasswordMailService.handle({ ...payload });
	}
);
