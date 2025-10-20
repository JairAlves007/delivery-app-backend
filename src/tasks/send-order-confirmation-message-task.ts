import { makeSendOrderConfirmationMessageService } from "@/factories/services/order/make-send-order-confirmation-message.ts";
import { ApiResponse } from "@/helpers/api.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";
import { logger, task } from "@trigger.dev/sdk";

export const sendOrderConfirmationTaskId = "send-order-confirmation-message";

export const sendOrderConfirmationTask = task({
	id: sendOrderConfirmationTaskId,
	queue: {
		name: sendOrderConfirmationTaskId
	},
	onFailure: async () => {
		logger.log("Error sending order confirmation message!");
	},
	run: async (payload: BuildOrderItemsParams, { ctx }) => {
		logger.log("Sending order confirmation message!", { payload, ctx });

		const sendOrderConfirmationMessageService =
			makeSendOrderConfirmationMessageService();

		await sendOrderConfirmationMessageService.handle({ ...payload });

		return ApiResponse.success(
			"Mensagem de confirmação enviada com sucesso",
			{}
		);
	}
});
