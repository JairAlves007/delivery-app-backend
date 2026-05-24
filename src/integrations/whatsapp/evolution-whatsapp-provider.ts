import { env } from "@/env.js";
import { WhatsAppProviderError } from "@/errors/whatsapp/provider-error.js";
import type {
	CreateWhatsAppInstanceInput,
	IWhatsAppProvider,
	SendWhatsAppMessageInput,
	SendWhatsAppMessageResult
} from "@/interfaces/integrations/whatsapp-provider.js";

type EvolutionSendResponse = {
	key?: { id?: string };
	messageId?: string;
};

export class EvolutionWhatsAppProvider implements IWhatsAppProvider {
	private baseUrl: string;
	private apiKey: string;

	constructor() {
		this.baseUrl = env.EVOLUTION_API_URL.replace(/\/$/, "");
		this.apiKey = env.EVOLUTION_API_KEY;
	}

	private async request<T>(path: string, init: RequestInit): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		const response = await fetch(url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				apikey: this.apiKey,
				...init.headers
			}
		});

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new WhatsAppProviderError(
				`${response.status} ${response.statusText} — ${text.slice(0, 500)}`
			);
		}

		if (response.status === 204) return undefined as T;

		return (await response.json()) as T;
	}

	async send(
		input: SendWhatsAppMessageInput
	): Promise<SendWhatsAppMessageResult> {
		const data = await this.request<EvolutionSendResponse>(
			`/message/sendText/${encodeURIComponent(input.instanceId)}`,
			{
				method: "POST",
				body: JSON.stringify({
					number: input.toPhone,
					text: input.message
				})
			}
		);

		const providerMessageId = data.key?.id ?? data.messageId;

		if (!providerMessageId) {
			throw new WhatsAppProviderError("provider did not return message id");
		}

		return { providerMessageId };
	}

	async createInstance(input: CreateWhatsAppInstanceInput): Promise<void> {
		await this.request("/instance/create", {
			method: "POST",
			body: JSON.stringify({
				instanceName: input.instanceId,
				integration: "WHATSAPP-BUSINESS",
				businessId: input.metaWabaId,
				phoneNumberId: input.metaPhoneNumberId,
				token: input.metaAccessToken,
				webhook: {
					url: input.webhookUrl,
					events: ["MESSAGES_UPDATE", "MESSAGES_UPSERT"]
				}
			})
		});
	}

	async deleteInstance(instanceId: string): Promise<void> {
		await this.request(
			`/instance/delete/${encodeURIComponent(instanceId)}`,
			{ method: "DELETE" }
		);
	}
}
