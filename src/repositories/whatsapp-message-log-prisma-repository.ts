import type { WhatsAppMessageLog } from "@/generated/prisma/client.js";
import type {
	CreateWhatsAppMessageLogInput,
	IWhatsAppMessageLogRepository,
	UpdateWhatsAppMessageLogByProviderMessageIdInput,
	UpdateWhatsAppMessageLogStatusInput
} from "@/interfaces/repositories/whatsapp-message-log-repository.js";
import prisma from "@/lib/prisma.js";

export class WhatsAppMessageLogPrismaRepository
	implements IWhatsAppMessageLogRepository
{
	async create(
		input: CreateWhatsAppMessageLogInput
	): Promise<WhatsAppMessageLog> {
		return await prisma.whatsAppMessageLog.create({
			data: {
				establishment_id: input.establishmentId,
				order_id: input.orderId ?? null,
				trigger: input.trigger,
				to_phone: input.toPhone
			}
		});
	}

	async updateStatus(
		input: UpdateWhatsAppMessageLogStatusInput
	): Promise<WhatsAppMessageLog> {
		return await prisma.whatsAppMessageLog.update({
			where: { id: input.id },
			data: {
				status: input.status,
				provider_message_id: input.providerMessageId,
				error_text: input.errorText,
				attempts: input.attempts,
				sent_at: input.sentAt,
				delivered_at: input.deliveredAt,
				read_at: input.readAt,
				failed_at: input.failedAt
			}
		});
	}

	async updateByProviderMessageId(
		input: UpdateWhatsAppMessageLogByProviderMessageIdInput
	): Promise<WhatsAppMessageLog | null> {
		const existing = await prisma.whatsAppMessageLog.findFirst({
			where: { provider_message_id: input.providerMessageId }
		});

		if (!existing) return null;

		return await prisma.whatsAppMessageLog.update({
			where: { id: existing.id },
			data: {
				status: input.status,
				delivered_at: input.deliveredAt,
				read_at: input.readAt,
				failed_at: input.failedAt,
				error_text: input.errorText
			}
		});
	}
}
