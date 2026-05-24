import type {
	OrderMessageTrigger,
	OrderStatusMessageTemplate
} from "@/generated/prisma/client.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";

export type UpsertOrderStatusMessageTemplateRequest = {
	establishmentId: string;
	trigger: OrderMessageTrigger;
	enabled: boolean;
	templateText: string;
};

export class UpsertOrderStatusMessageTemplateService {
	private templateRepository: IOrderStatusMessageTemplateRepository;

	constructor(templateRepository: IOrderStatusMessageTemplateRepository) {
		this.templateRepository = templateRepository;
	}

	async handle(
		request: UpsertOrderStatusMessageTemplateRequest
	): Promise<OrderStatusMessageTemplate> {
		return await this.templateRepository.upsert({
			establishmentId: request.establishmentId,
			trigger: request.trigger,
			enabled: request.enabled,
			templateText: request.templateText
		});
	}
}
