import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { UpsertOrderStatusMessageTemplateService } from "@/services/whatsapp/upsert-order-status-message-template-service.js";

export const makeUpsertOrderStatusMessageTemplateService = () => {
	return new UpsertOrderStatusMessageTemplateService(
		makeOrderStatusMessageTemplateRepository()
	);
};
