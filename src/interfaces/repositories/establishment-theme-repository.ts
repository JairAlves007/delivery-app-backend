import type { EstablishmentTheme } from "@/generated/prisma/client.js";

export type UpsertEstablishmentThemeInput = {
	primary: string;
	secondary: string;
	destructive: string;
	background: string;
	foreground: string;
	muted: string;
	border: string;
	primary_dark: string;
	secondary_dark: string;
	destructive_dark: string;
	background_dark: string;
	foreground_dark: string;
	muted_dark: string;
	border_dark: string;
};

export interface IEstablishmentThemeRepository {
	findByEstablishmentId(
		establishmentId: string
	): Promise<EstablishmentTheme | null>;
	upsert(params: {
		establishmentId: string;
		data: UpsertEstablishmentThemeInput;
	}): Promise<EstablishmentTheme>;
}
