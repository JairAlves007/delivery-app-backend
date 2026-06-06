import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { ListOrderStatusTemplatesService } from "@/services/whatsapp/template/list-order-status-templates-service.js";

export const makeListOrderStatusTemplatesService = () => {
  const templateRepository = makeOrderStatusMessageTemplateRepository();

  return new ListOrderStatusTemplatesService(templateRepository);
};
