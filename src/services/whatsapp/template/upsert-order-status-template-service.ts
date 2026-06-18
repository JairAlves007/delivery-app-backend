import type { OrderStatusType } from "@/generated/prisma/client.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type UpsertOrderStatusTemplateRequest = {
  establishmentId: EstablishmentID;
  status: OrderStatusType;
  isScheduled: boolean;
  body: string;
  isActive?: boolean;
};

export class UpsertOrderStatusTemplateService {
  private templateRepository: IOrderStatusMessageTemplateRepository;

  constructor(templateRepository: IOrderStatusMessageTemplateRepository) {
    this.templateRepository = templateRepository;
  }

  async handle({
    establishmentId,
    status,
    isScheduled,
    body,
    isActive,
  }: UpsertOrderStatusTemplateRequest): Promise<void> {
    await this.templateRepository.upsert({
      establishmentId,
      status,
      isScheduled,
      body,
      isActive,
    });
  }
}
