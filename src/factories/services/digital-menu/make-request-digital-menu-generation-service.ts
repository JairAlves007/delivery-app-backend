import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { RequestDigitalMenuGenerationService } from "@/services/digital-menu/request-digital-menu-generation-service.js";

export const makeRequestDigitalMenuGenerationService = () => {
  const digitalMenuRepository = makeDigitalMenuRepository();

  return new RequestDigitalMenuGenerationService(digitalMenuRepository);
};
