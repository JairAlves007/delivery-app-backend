import type {
	OrderMessageTrigger,
	OrderStatusMessageTemplate
} from "@/generated/prisma/client.js";
import type {
	IOrderStatusMessageTemplateRepository,
	UpsertOrderStatusMessageTemplateInput
} from "@/interfaces/repositories/order-status-message-template-repository.js";
import prisma from "@/lib/prisma.js";

export class OrderStatusMessageTemplatePrismaRepository
	implements IOrderStatusMessageTemplateRepository
{
	async listByEstablishmentId(
		establishmentId: string
	): Promise<OrderStatusMessageTemplate[]> {
		return await prisma.orderStatusMessageTemplate.findMany({
			where: { establishment_id: establishmentId },
			orderBy: { trigger: "asc" }
		});
	}

	async findByEstablishmentIdAndTrigger(
		establishmentId: string,
		trigger: OrderMessageTrigger
	): Promise<OrderStatusMessageTemplate | null> {
		return await prisma.orderStatusMessageTemplate.findUnique({
			where: {
				establishment_id_trigger: {
					establishment_id: establishmentId,
					trigger
				}
			}
		});
	}

	async upsert(
		input: UpsertOrderStatusMessageTemplateInput
	): Promise<OrderStatusMessageTemplate> {
		return await prisma.orderStatusMessageTemplate.upsert({
			where: {
				establishment_id_trigger: {
					establishment_id: input.establishmentId,
					trigger: input.trigger
				}
			},
			create: {
				establishment_id: input.establishmentId,
				trigger: input.trigger,
				enabled: input.enabled,
				template_text: input.templateText
			},
			update: {
				enabled: input.enabled,
				template_text: input.templateText
			}
		});
	}
}
