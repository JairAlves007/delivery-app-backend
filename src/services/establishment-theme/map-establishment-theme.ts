import type { EstablishmentTheme } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";

export type EstablishmentThemePayload = {
	schemaVersion: string;
	colors: {
		primary: string;
		secondary: string;
		destructive: string;
		background: string;
		foreground: string;
		muted: string;
		border: string;
	};
	colorsDark: {
		primary: string;
		secondary: string;
		destructive: string;
		background: string;
		foreground: string;
		muted: string;
		border: string;
	};
};

export const mapEstablishmentTheme = (params: {
	row: EstablishmentTheme | null;
}): EstablishmentThemePayload => {
	const { row } = params;
	const defaults = Constants.DEFAULT_ESTABLISHMENT_THEME;

	const colors = row
		? {
				primary: row.primary,
				secondary: row.secondary,
				destructive: row.destructive,
				background: row.background,
				foreground: row.foreground,
				muted: row.muted,
				border: row.border
			}
		: { ...defaults.colors };

	const colorsDark = row
		? {
				primary: row.primary_dark,
				secondary: row.secondary_dark,
				destructive: row.destructive_dark,
				background: row.background_dark,
				foreground: row.foreground_dark,
				muted: row.muted_dark,
				border: row.border_dark
			}
		: { ...defaults.colorsDark };

	return {
		schemaVersion: Constants.THEME_SCHEMA_VERSION,
		colors,
		colorsDark
	};
};
