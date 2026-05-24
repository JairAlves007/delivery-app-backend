import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { ListOrderStatusMessageTemplatesService } from "@/services/whatsapp/list-order-status-message-templates-service.js";

export const makeListOrderStatusMessageTemplatesService = () => {
	return new ListOrderStatusMessageTemplatesService(
		makeOrderStatusMessageTemplateRepository()
	);
};
