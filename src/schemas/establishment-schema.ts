import z from "zod";

import { SocialPlatform, WeekDay } from "@/generated/prisma/client.js";
import { checkIfCNPJIsValid } from "@/helpers/validation-errors.js";

import { addressLocationSchema, userEmailSchema } from "./generic-schema.js";

const HH_MM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const openingHourInputSchema = z
	.object({
		dayOfWeek: z.enum(WeekDay, "Dia da semana inválido"),
		opensAt: z
			.string()
			.regex(HH_MM_REGEX, "opensAt deve estar no formato HH:MM")
			.optional(),
		closesAt: z
			.string()
			.regex(HH_MM_REGEX, "closesAt deve estar no formato HH:MM")
			.optional(),
		isClosed: z.boolean("isClosed deve ser preenchido")
	})
	.superRefine((data, ctx) => {
		if (data.isClosed) return;

		if (!data.opensAt) {
			ctx.addIssue({
				code: "custom",
				message: "opensAt é obrigatório quando isClosed=false",
				path: ["opensAt"]
			});
		}

		if (!data.closesAt) {
			ctx.addIssue({
				code: "custom",
				message: "closesAt é obrigatório quando isClosed=false",
				path: ["closesAt"]
			});
		}

		if (data.opensAt && data.closesAt && data.opensAt === data.closesAt) {
			ctx.addIssue({
				code: "custom",
				message: "opensAt e closesAt não podem ser iguais",
				path: ["closesAt"]
			});
		}
	});

z.globalRegistry.add(openingHourInputSchema, { id: "OpeningHourInput" });

export const socialLinkInputSchema = z.object({
	platform: z.enum(SocialPlatform, "Plataforma de rede social inválida"),
	url: z.url("URL da rede social inválida").max(2048).nullable()
});

z.globalRegistry.add(socialLinkInputSchema, { id: "SocialLinkInput" });

export const createEstablishmentBodySchema = z.object({
	name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
	address: addressLocationSchema,
	description: z
		.string()
		.trim()
		.min(1, "A descrição deve ser preenchida")
		.max(1000, "A descrição deve ter no máximo 1000 caracteres"),
	email: userEmailSchema,
	cnpj: z
		.string()
		.max(18, "CNPJ inválido")
		.transform(val => val.replace(/\D/g, ""))
		.refine(val => checkIfCNPJIsValid(val), {
			message: "CNPJ inválido"
		})
		.transform(val => val.replace(/\D/g, ""))
		.nullable()
		.optional(),
	onlyDelivery: z.boolean(
		"Precisamos saber se o estabelecimento só aceita entregas"
	),
	acceptsCreditCard: z.boolean("Precisamos saber se aceita cartão de crédito"),
	nextBillingDate: z.coerce
		.date("Precisamos saber a data de próximo pagamento")
		.refine(val => val >= new Date(), {
			message: "Precisamos saber a data de próximo pagamento"
		}),
	openingHours: z.array(openingHourInputSchema).optional(),
	socialLinks: z.array(socialLinkInputSchema).optional()
});

z.globalRegistry.add(createEstablishmentBodySchema, {
	id: "CreateEstablishmentBody"
});

export const updateEstablishmentBodySchema = createEstablishmentBodySchema
	.partial()
	.extend({ isListedInHub: z.boolean().optional() });

z.globalRegistry.add(updateEstablishmentBodySchema, {
	id: "UpdateEstablishmentBody"
});

export const updateMyEstablishmentBodySchema = createEstablishmentBodySchema
	.omit({ nextBillingDate: true })
	.partial()
	.extend({ isListedInHub: z.boolean().optional() });

z.globalRegistry.add(updateMyEstablishmentBodySchema, {
	id: "UpdateMyEstablishmentBody"
});

export const establishmentParamsSchema = z.object({
	id: z.ulid().min(1, "O id do estabelecimento deve ser preenchido")
});
