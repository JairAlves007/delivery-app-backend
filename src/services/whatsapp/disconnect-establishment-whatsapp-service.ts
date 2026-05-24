import { WhatsAppIntegrationNotFound } from "@/errors/whatsapp/integration-not-found-error.js";
import { app } from "@/http/app.js";
import type { IWhatsAppProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsAppIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";

export class DisconnectEstablishmentWhatsAppService {
	private integrationRepository: IEstablishmentWhatsAppIntegrationRepository;
	private provider: IWhatsAppProvider;

	constructor(
		integrationRepository: IEstablishmentWhatsAppIntegrationRepository,
		provider: IWhatsAppProvider
	) {
		this.integrationRepository = integrationRepository;
		this.provider = provider;
	}

	async handle(establishmentId: string): Promise<void> {
		const integration = await this.integrationRepository.findByEstablishmentId(
			establishmentId
		);

		if (!integration) throw new WhatsAppIntegrationNotFound();

		try {
			await this.provider.deleteInstance(integration.evolution_instance_id);
		} catch (error) {
			app.log.warn(
				{ error, establishmentId },
				"[WhatsApp] failed to delete instance on provider — proceeding with soft delete"
			);
		}

		await this.integrationRepository.softDelete(establishmentId);
	}
}
