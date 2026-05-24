import type { OrderStatusMessageTemplate } from "@/generated/prisma/client.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";

export class ListOrderStatusMessageTemplatesService {
	private templateRepository: IOrderStatusMessageTemplateRepository;

	constructor(templateRepository: IOrderStatusMessageTemplateRepository) {
		this.templateRepository = templateRepository;
	}

	async handle(establishmentId: string): Promise<OrderStatusMessageTemplate[]> {
		return await this.templateRepository.listByEstablishmentId(establishmentId);
	}
}
