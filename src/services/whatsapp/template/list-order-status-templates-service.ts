import { OrderStatusType } from "@/generated/prisma/client.js";
import {
  DEFAULT_SCHEDULED_STATUS_TEMPLATES,
  DEFAULT_STATUS_TEMPLATES,
} from "@/helpers/whatsapp-templates.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ListOrderStatusTemplatesRequest = {
  establishmentId: EstablishmentID;
};

type OrderStatusTemplateItem = {
  status: OrderStatusType;
  isScheduled: boolean;
  body: string;
  isActive: boolean;
  isDefault: boolean;
};

type ListOrderStatusTemplatesResponse = {
  templates: OrderStatusTemplateItem[];
};

export class ListOrderStatusTemplatesService {
  private templateRepository: IOrderStatusMessageTemplateRepository;

  constructor(templateRepository: IOrderStatusMessageTemplateRepository) {
    this.templateRepository = templateRepository;
  }

  async handle({
    establishmentId,
  }: ListOrderStatusTemplatesRequest): Promise<ListOrderStatusTemplatesResponse> {
    const templates =
      await this.templateRepository.listByEstablishment(establishmentId);

    const byKey = new Map(
      templates.map((template) => [
        `${template.status}:${template.is_scheduled}`,
        template,
      ]),
    );

    const allStatuses = Object.values(OrderStatusType);
    const variants = [false, true];

    return {
      templates: allStatuses.flatMap((status) =>
        variants.map((isScheduled) => {
          const custom = byKey.get(`${status}:${isScheduled}`);
          const defaults = isScheduled
            ? DEFAULT_SCHEDULED_STATUS_TEMPLATES
            : DEFAULT_STATUS_TEMPLATES;

          return {
            status,
            isScheduled,
            body: custom?.body ?? defaults[status],
            isActive: custom?.is_active ?? true,
            isDefault: !custom,
          };
        }),
      ),
    };
  }
}
