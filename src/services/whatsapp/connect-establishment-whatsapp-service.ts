import { env } from "@/env.js";
import {
	type EstablishmentWhatsAppIntegration,
	WhatsAppIntegrationStatus
} from "@/generated/prisma/client.js";
import { encryptSecret } from "@/helpers/crypto.js";
import type { IWhatsAppProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsAppIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";

export type ConnectEstablishmentWhatsAppInput = {
	establishmentId: string;
	metaPhoneNumberId: string;
	metaWabaId: string;
	metaAccessToken: string;
};

const buildInstanceId = (establishmentId: string): string => {
	return `estab_${establishmentId}`;
};

const buildWebhookUrl = (establishmentId: string): string => {
	const baseUrl = env.APP_URL.replace(/\/$/, "");
	return `${baseUrl}/api/webhooks/whatsapp/${establishmentId}`;
};

export class ConnectEstablishmentWhatsAppService {
	private integrationRepository: IEstablishmentWhatsAppIntegrationRepository;
	private provider: IWhatsAppProvider;

	constructor(
		integrationRepository: IEstablishmentWhatsAppIntegrationRepository,
		provider: IWhatsAppProvider
	) {
		this.integrationRepository = integrationRepository;
		this.provider = provider;
	}

	async handle(
		input: ConnectEstablishmentWhatsAppInput
	): Promise<EstablishmentWhatsAppIntegration> {
		const instanceId = buildInstanceId(input.establishmentId);
		const webhookUrl = buildWebhookUrl(input.establishmentId);

		await this.provider.createInstance({
			instanceId,
			metaPhoneNumberId: input.metaPhoneNumberId,
			metaWabaId: input.metaWabaId,
			metaAccessToken: input.metaAccessToken,
			webhookUrl
		});

		const encryptedToken = encryptSecret(input.metaAccessToken);

		const integration = await this.integrationRepository.upsert({
			establishmentId: input.establishmentId,
			evolutionInstanceId: instanceId,
			metaPhoneNumberId: input.metaPhoneNumberId,
			metaWabaId: input.metaWabaId,
			metaAccessTokenEncrypted: encryptedToken,
			status: WhatsAppIntegrationStatus.CONNECTED
		});

		return await this.integrationRepository.updateStatus({
			establishmentId: input.establishmentId,
			status: WhatsAppIntegrationStatus.CONNECTED,
			lastConnectedAt: new Date(),
			lastError: null
		}).catch(() => integration);
	}
}
