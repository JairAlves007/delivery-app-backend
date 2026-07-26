import z from "zod";

const hexColorSchema = z
	.string()
	.regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida. Use o formato #RRGGBB");

export const updateEstablishmentThemeBodySchema = z.object({
	primary: hexColorSchema.optional(),
	secondary: hexColorSchema.optional(),
	destructive: hexColorSchema.optional(),
	background: hexColorSchema.optional(),
	foreground: hexColorSchema.optional(),
	muted: hexColorSchema.optional(),
	border: hexColorSchema.optional(),
	primaryDark: hexColorSchema.optional(),
	secondaryDark: hexColorSchema.optional(),
	destructiveDark: hexColorSchema.optional(),
	backgroundDark: hexColorSchema.optional(),
	foregroundDark: hexColorSchema.optional(),
	mutedDark: hexColorSchema.optional(),
	borderDark: hexColorSchema.optional()
});

z.globalRegistry.add(updateEstablishmentThemeBodySchema, {
	id: "UpdateEstablishmentThemeBody"
});

