import type { EstablishmentWhatsAppIntegration } from "@/generated/prisma/client.js";
import type { IEstablishmentWhatsAppIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";

export class FindEstablishmentWhatsAppIntegrationService {
	private integrationRepository: IEstablishmentWhatsAppIntegrationRepository;

	constructor(integrationRepository: IEstablishmentWhatsAppIntegrationRepository) {
		this.integrationRepository = integrationRepository;
	}

	async handle(
		establishmentId: string
	): Promise<EstablishmentWhatsAppIntegration | null> {
		return await this.integrationRepository.findByEstablishmentId(
			establishmentId
		);
	}
}
