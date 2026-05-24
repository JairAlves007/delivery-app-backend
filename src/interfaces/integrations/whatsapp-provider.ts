export interface SendWhatsAppMessageInput {
	instanceId: string;
	toPhone: string;
	message: string;
}

export interface SendWhatsAppMessageResult {
	providerMessageId: string;
}

export interface CreateWhatsAppInstanceInput {
	instanceId: string;
	metaPhoneNumberId: string;
	metaWabaId: string;
	metaAccessToken: string;
	webhookUrl: string;
}

export interface IWhatsAppProvider {
	send(input: SendWhatsAppMessageInput): Promise<SendWhatsAppMessageResult>;
	createInstance(input: CreateWhatsAppInstanceInput): Promise<void>;
	deleteInstance(instanceId: string): Promise<void>;
}
