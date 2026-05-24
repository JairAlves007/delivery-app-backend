import {
	OrderMessageTrigger,
	WhatsAppIntegrationStatus,
	WhatsAppMessageStatus
} from "@/generated/prisma/client.js";
import { WHATSAPP_DEFAULT_TEMPLATES } from "@/helpers/whatsapp-default-templates.js";
import {
	renderWhatsAppTemplate,
	sanitizePhoneForWhatsApp
} from "@/helpers/whatsapp-template-renderer.js";
import { app } from "@/http/app.js";
import type { IWhatsAppProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsAppIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { IWhatsAppMessageLogRepository } from "@/interfaces/repositories/whatsapp-message-log-repository.js";
import type { SendWhatsAppMessageJob } from "@/types/whatsapp.js";

export class SendWhatsAppMessageService {
	private integrationRepository: IEstablishmentWhatsAppIntegrationRepository;
	private templateRepository: IOrderStatusMessageTemplateRepository;
	private logRepository: IWhatsAppMessageLogRepository;
	private provider: IWhatsAppProvider;

	constructor(
		integrationRepository: IEstablishmentWhatsAppIntegrationRepository,
		templateRepository: IOrderStatusMessageTemplateRepository,
		logRepository: IWhatsAppMessageLogRepository,
		provider: IWhatsAppProvider
	) {
		this.integrationRepository = integrationRepository;
		this.templateRepository = templateRepository;
		this.logRepository = logRepository;
		this.provider = provider;
	}

	private async resolveMessage(job: SendWhatsAppMessageJob): Promise<string | null> {
		const template = await this.templateRepository.findByEstablishmentIdAndTrigger(
			job.establishmentId,
			job.trigger
		);

		if (template) {
			if (!template.enabled) return null;
			return renderWhatsAppTemplate(template.template_text, job.context);
		}

		if (job.trigger === OrderMessageTrigger.ORDER_CONFIRMED) {
			return (
				job.fallbackMessage ??
				renderWhatsAppTemplate(
					WHATSAPP_DEFAULT_TEMPLATES[OrderMessageTrigger.ORDER_CONFIRMED],
					job.context
				)
			);
		}

		return null;
	}

	async handle(job: SendWhatsAppMessageJob): Promise<void> {
		const integration = await this.integrationRepository.findByEstablishmentId(
			job.establishmentId
		);

		if (!integration || integration.status !== WhatsAppIntegrationStatus.CONNECTED) {
			app.log.info(
				{ establishmentId: job.establishmentId, trigger: job.trigger },
				"[WhatsApp] skip — integration not connected"
			);
			return;
		}

		const message = await this.resolveMessage(job);

		if (!message) {
			app.log.info(
				{ establishmentId: job.establishmentId, trigger: job.trigger },
				"[WhatsApp] skip — no template enabled for trigger"
			);
			return;
		}

		const log = await this.logRepository.create({
			establishmentId: job.establishmentId,
			orderId: job.orderId ?? null,
			trigger: job.trigger,
			toPhone: job.toPhone
		});

		try {
			const result = await this.provider.send({
				instanceId: integration.evolution_instance_id,
				toPhone: sanitizePhoneForWhatsApp(job.toPhone),
				message
			});

			await this.logRepository.updateStatus({
				id: log.id,
				status: WhatsAppMessageStatus.SENT,
				providerMessageId: result.providerMessageId,
				sentAt: new Date(),
				attempts: 1
			});
		} catch (error) {
			const errorText = error instanceof Error ? error.message : String(error);
			await this.logRepository.updateStatus({
				id: log.id,
				status: WhatsAppMessageStatus.FAILED,
				errorText,
				failedAt: new Date(),
				attempts: 1
			});
			throw error;
		}
	}
}
