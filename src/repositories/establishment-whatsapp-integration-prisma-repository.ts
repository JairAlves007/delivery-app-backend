import type { EstablishmentWhatsAppIntegration } from "@/generated/prisma/client.js";
import type {
	CreateEstablishmentWhatsAppIntegrationInput,
	IEstablishmentWhatsAppIntegrationRepository,
	UpdateEstablishmentWhatsAppIntegrationStatusInput
} from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import prisma from "@/lib/prisma.js";

export class EstablishmentWhatsAppIntegrationPrismaRepository
	implements IEstablishmentWhatsAppIntegrationRepository
{
	async findByEstablishmentId(
		establishmentId: string
	): Promise<EstablishmentWhatsAppIntegration | null> {
		return await prisma.establishmentWhatsAppIntegration.findFirst({
			where: { establishment_id: establishmentId, deleted_at: null }
		});
	}

	async upsert(
		input: CreateEstablishmentWhatsAppIntegrationInput
	): Promise<EstablishmentWhatsAppIntegration> {
		return await prisma.establishmentWhatsAppIntegration.upsert({
			where: { establishment_id: input.establishmentId },
			create: {
				establishment_id: input.establishmentId,
				evolution_instance_id: input.evolutionInstanceId,
				meta_phone_number_id: input.metaPhoneNumberId,
				meta_waba_id: input.metaWabaId,
				meta_access_token: input.metaAccessTokenEncrypted,
				status: input.status
			},
			update: {
				evolution_instance_id: input.evolutionInstanceId,
				meta_phone_number_id: input.metaPhoneNumberId,
				meta_waba_id: input.metaWabaId,
				meta_access_token: input.metaAccessTokenEncrypted,
				status: input.status,
				deleted_at: null,
				last_error: null
			}
		});
	}

	async updateStatus(
		input: UpdateEstablishmentWhatsAppIntegrationStatusInput
	): Promise<EstablishmentWhatsAppIntegration> {
		return await prisma.establishmentWhatsAppIntegration.update({
			where: { establishment_id: input.establishmentId },
			data: {
				status: input.status,
				last_connected_at: input.lastConnectedAt,
				last_error: input.lastError
			}
		});
	}

	async softDelete(establishmentId: string): Promise<void> {
		await prisma.establishmentWhatsAppIntegration.update({
			where: { establishment_id: establishmentId },
			data: { deleted_at: new Date(), status: "DISCONNECTED" }
		});
	}
}
