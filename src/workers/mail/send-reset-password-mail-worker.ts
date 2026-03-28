import { makeSendResetPasswordMailService } from "@/factories/services/mail/make-send-reset-password-mail-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { mailQueueName } from "@/queues/mail-queue.js";
import type { SendResetPasswordMailEventType } from "@/types/mail.js";

export const setupSendResetPasswordMailWorker = async () => {
	const mailQueue = makeQueue<SendResetPasswordMailEventType>(mailQueueName);

	mailQueue.registerProcessor(async payload => {
		try {
			const sendResetPasswordMailService = makeSendResetPasswordMailService();

			await sendResetPasswordMailService.handle({ ...payload });
		} catch (error) {
			console.log("[Worker] Error sending reset password mail:", error);
		}
	});
};
