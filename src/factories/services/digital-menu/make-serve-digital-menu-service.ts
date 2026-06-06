import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { ServeDigitalMenuService } from "@/services/digital-menu/serve-digital-menu-service.js";

export const makeServeDigitalMenuService = () => {
  const digitalMenuRepository = makeDigitalMenuRepository();

  return new ServeDigitalMenuService(digitalMenuRepository);
};
