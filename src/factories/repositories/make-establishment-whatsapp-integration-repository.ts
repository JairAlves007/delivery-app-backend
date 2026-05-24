import { EstablishmentWhatsAppIntegrationPrismaRepository } from "@/repositories/establishment-whatsapp-integration-prisma-repository.js";

export const makeEstablishmentWhatsAppIntegrationRepository = () => {
	return new EstablishmentWhatsAppIntegrationPrismaRepository();
};
