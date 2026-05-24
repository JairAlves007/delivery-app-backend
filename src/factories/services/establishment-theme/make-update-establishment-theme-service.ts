import { makeEstablishmentThemeRepository } from "@/factories/repositories/make-establishment-theme-repository.js";
import { UpdateEstablishmentThemeService } from "@/services/establishment-theme/update-establishment-theme-service.js";

export const makeUpdateEstablishmentThemeService = () => {
	const establishmentThemeRepository = makeEstablishmentThemeRepository();
	return new UpdateEstablishmentThemeService(establishmentThemeRepository);
};
