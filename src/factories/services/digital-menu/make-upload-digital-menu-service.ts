import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { UploadDigitalMenuService } from "@/services/digital-menu/upload-digital-menu-service.js";

export const makeUploadDigitalMenuService = () => {
  const digitalMenuRepository = makeDigitalMenuRepository();

  return new UploadDigitalMenuService(digitalMenuRepository);
};
