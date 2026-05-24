import type {
	OrderMessageTrigger,
	WhatsAppMessageLog,
	WhatsAppMessageStatus
} from "@/generated/prisma/client.js";

export type CreateWhatsAppMessageLogInput = {
	establishmentId: string;
	orderId?: string | null;
	trigger: OrderMessageTrigger;
	toPhone: string;
};

export type UpdateWhatsAppMessageLogStatusInput = {
	id: string;
	status: WhatsAppMessageStatus;
	providerMessageId?: string | null;
	errorText?: string | null;
	attempts?: number;
	sentAt?: Date | null;
	deliveredAt?: Date | null;
	readAt?: Date | null;
	failedAt?: Date | null;
};

export type UpdateWhatsAppMessageLogByProviderMessageIdInput = {
	providerMessageId: string;
	status: WhatsAppMessageStatus;
	deliveredAt?: Date | null;
	readAt?: Date | null;
	failedAt?: Date | null;
	errorText?: string | null;
};

export interface IWhatsAppMessageLogRepository {
	create(input: CreateWhatsAppMessageLogInput): Promise<WhatsAppMessageLog>;
	updateStatus(
		input: UpdateWhatsAppMessageLogStatusInput
	): Promise<WhatsAppMessageLog>;
	updateByProviderMessageId(
		input: UpdateWhatsAppMessageLogByProviderMessageIdInput
	): Promise<WhatsAppMessageLog | null>;
}
