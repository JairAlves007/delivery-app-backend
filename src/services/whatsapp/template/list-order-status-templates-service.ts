import { OrderStatusType } from "@/generated/prisma/client.js";
import { DEFAULT_STATUS_TEMPLATES } from "@/helpers/whatsapp-templates.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ListOrderStatusTemplatesRequest = {
  establishmentId: EstablishmentID;
};

type OrderStatusTemplateItem = {
  status: OrderStatusType;
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

    const byStatus = new Map(
      templates.map((template) => [template.status, template]),
    );

    const allStatuses = Object.values(OrderStatusType);

    return {
      templates: allStatuses.map((status) => {
        const custom = byStatus.get(status);

        return {
          status,
          body: custom?.body ?? DEFAULT_STATUS_TEMPLATES[status],
          isActive: custom?.is_active ?? true,
          isDefault: !custom,
        };
      }),
    };
  }
}
