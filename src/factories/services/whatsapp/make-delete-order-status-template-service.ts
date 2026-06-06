import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { DeleteOrderStatusTemplateService } from "@/services/whatsapp/template/delete-order-status-template-service.js";

export const makeDeleteOrderStatusTemplateService = () => {
  const templateRepository = makeOrderStatusMessageTemplateRepository();

  return new DeleteOrderStatusTemplateService(templateRepository);
};
