import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { GetDigitalMenuStatusService } from "@/services/digital-menu/get-digital-menu-status-service.js";

export const makeGetDigitalMenuStatusService = () => {
  const digitalMenuRepository = makeDigitalMenuRepository();

  return new GetDigitalMenuStatusService(digitalMenuRepository);
};
