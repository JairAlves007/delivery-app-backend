import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { makeGetEstablishmentThemeService } from "@/factories/services/establishment-theme/make-get-establishment-theme-service.js";
import { GenerateDigitalMenuService } from "@/services/digital-menu/generate-digital-menu-service.js";

export const makeGenerateDigitalMenuService = () => {
  const digitalMenuRepository = makeDigitalMenuRepository();
  const getEstablishmentThemeService = makeGetEstablishmentThemeService();

  return new GenerateDigitalMenuService(
    digitalMenuRepository,
    getEstablishmentThemeService,
  );
};
