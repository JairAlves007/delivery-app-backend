import { makeEstablishmentThemeRepository } from "@/factories/repositories/make-establishment-theme-repository.js";
import { GetEstablishmentThemeService } from "@/services/establishment-theme/get-establishment-theme-service.js";

export const makeGetEstablishmentThemeService = () => {
	const establishmentThemeRepository = makeEstablishmentThemeRepository();
	return new GetEstablishmentThemeService(establishmentThemeRepository);
};
