import type { EstablishmentWhatsAppIntegration } from "@/generated/prisma/client.js";

export type WhatsAppIntegrationPayload = {
	id: string;
	status: EstablishmentWhatsAppIntegration["status"];
	metaPhoneNumberId: string;
	metaWabaId: string;
	lastConnectedAt: string | null;
	lastError: string | null;
	createdAt: string;
	updatedAt: string;
};

export const mapWhatsAppIntegration = (
	row: EstablishmentWhatsAppIntegration
): WhatsAppIntegrationPayload => {
	return {
		id: row.id,
		status: row.status,
		metaPhoneNumberId: row.meta_phone_number_id,
		metaWabaId: row.meta_waba_id,
		lastConnectedAt: row.last_connected_at?.toISOString() ?? null,
		lastError: row.last_error,
		createdAt: row.created_at.toISOString(),
		updatedAt: row.updated_at.toISOString()
	};
};

export const mapWhatsAppIntegrationNullable = (
	row: EstablishmentWhatsAppIntegration | null
): WhatsAppIntegrationPayload | null => {
	if (!row) return null;
	return mapWhatsAppIntegration(row);
};
