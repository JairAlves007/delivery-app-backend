import { makeOrderStatusMessageTemplateRepository } from "@/factories/repositories/make-order-status-message-template-repository.js";
import { UpsertOrderStatusTemplateService } from "@/services/whatsapp/template/upsert-order-status-template-service.js";

export const makeUpsertOrderStatusTemplateService = () => {
  const templateRepository = makeOrderStatusMessageTemplateRepository();

  return new UpsertOrderStatusTemplateService(templateRepository);
};
