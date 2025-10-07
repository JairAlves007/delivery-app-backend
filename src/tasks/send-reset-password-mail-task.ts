import { makeSendResetPasswordMailService } from "@/factories/services/mail/make-send-reset-password-mail-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { resetPasswordMailBodySchema } from "@/schemas/mail-schema.ts";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";

export const sendResetPasswordMailTaskId = "send-reset-password-mail";

export const sendResetPasswordMailTask = schemaTask({
	id: sendResetPasswordMailTaskId,
	queue: {
		name: sendResetPasswordMailTaskId
	},
	schema: resetPasswordMailBodySchema,
	maxDuration: 300,
	onFailure: error => {
		logger.log("Error sending reset password mail!", { error });
	},
	run: async (payload, { ctx }) => {
		logger.log("Sending reset password mail!", { payload, ctx });

		const sendResetPasswordMailService = makeSendResetPasswordMailService();

		await sendResetPasswordMailService.handle({ ...payload });

		return ApiResponse.success("Email enviado com sucesso", {});
	}
});
