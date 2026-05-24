import type {
	OrderMessageTrigger,
	OrderStatusMessageTemplate
} from "@/generated/prisma/client.js";

export type UpsertOrderStatusMessageTemplateInput = {
	establishmentId: string;
	trigger: OrderMessageTrigger;
	enabled: boolean;
	templateText: string;
};

export interface IOrderStatusMessageTemplateRepository {
	listByEstablishmentId(
		establishmentId: string
	): Promise<OrderStatusMessageTemplate[]>;
	findByEstablishmentIdAndTrigger(
		establishmentId: string,
		trigger: OrderMessageTrigger
	): Promise<OrderStatusMessageTemplate | null>;
	upsert(
		input: UpsertOrderStatusMessageTemplateInput
	): Promise<OrderStatusMessageTemplate>;
}
