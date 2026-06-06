import type { OrderStatusType } from "@/generated/prisma/client.js";
import type { IOrderStatusMessageTemplateRepository } from "@/interfaces/repositories/order-status-message-template-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DeleteOrderStatusTemplateRequest = {
  establishmentId: EstablishmentID;
  status: OrderStatusType;
};

export class DeleteOrderStatusTemplateService {
  private templateRepository: IOrderStatusMessageTemplateRepository;

  constructor(templateRepository: IOrderStatusMessageTemplateRepository) {
    this.templateRepository = templateRepository;
  }

  async handle({
    establishmentId,
    status,
  }: DeleteOrderStatusTemplateRequest): Promise<void> {
    await this.templateRepository.softDelete({ establishmentId, status });
  }
}
