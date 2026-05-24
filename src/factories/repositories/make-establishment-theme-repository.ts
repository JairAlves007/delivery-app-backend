import { EstablishmentThemePrismaRepository } from "@/repositories/establishment-theme-prisma-repository.js";

export const makeEstablishmentThemeRepository = () => {
	return new EstablishmentThemePrismaRepository();
};
