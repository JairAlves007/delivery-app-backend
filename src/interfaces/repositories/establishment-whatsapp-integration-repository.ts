import type {
	EstablishmentWhatsAppIntegration,
	WhatsAppIntegrationStatus
} from "@/generated/prisma/client.js";

export type CreateEstablishmentWhatsAppIntegrationInput = {
	establishmentId: string;
	evolutionInstanceId: string;
	metaPhoneNumberId: string;
	metaWabaId: string;
	metaAccessTokenEncrypted: string;
	status: WhatsAppIntegrationStatus;
};

export type UpdateEstablishmentWhatsAppIntegrationStatusInput = {
	establishmentId: string;
	status: WhatsAppIntegrationStatus;
	lastConnectedAt?: Date | null;
	lastError?: string | null;
};

export interface IEstablishmentWhatsAppIntegrationRepository {
	findByEstablishmentId(
		establishmentId: string
	): Promise<EstablishmentWhatsAppIntegration | null>;
	upsert(
		input: CreateEstablishmentWhatsAppIntegrationInput
	): Promise<EstablishmentWhatsAppIntegration>;
	updateStatus(
		input: UpdateEstablishmentWhatsAppIntegrationStatusInput
	): Promise<EstablishmentWhatsAppIntegration>;
	softDelete(establishmentId: string): Promise<void>;
}
