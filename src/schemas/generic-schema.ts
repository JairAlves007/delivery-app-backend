import z from "zod";

import Constants from "@/helpers/constants.js";

export const establishmentIdSchema = z
	.ulid("O id do estabelecimento deve ser preenchido")
	.min(1, "O id do estabelecimento deve ser preenchido");

export const establishmentParamsSchema = z.object({
	establishmentId: establishmentIdSchema
});

export const establishmentSlugSchema = z.object({
	slug: z.string().trim().min(1, "O slug deve ser preenchido").max(255)
});

export const searchAndOrderBySchema = z.object({
	search: z
		.string()
		.trim()
		.max(255)
		.transform(val => val.toLowerCase())
		.optional()
		.nullable(),
	sortField: z
		.string()
		.trim()
		.max(100)
		.transform(val => val.toLowerCase())
		.optional()
		.nullable(),
	sortDirection: z
		.enum(["asc", "desc"], "Ordenação inválida")
		.transform(val => val.toLowerCase())
		.optional()
		.nullable()
});

export const listQueryParamsSchema = searchAndOrderBySchema.extend({
	page: z.coerce.number().int().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().int().min(1, "Limite inválido").default(12)
});

export const listCursorQueryParamsSchema = searchAndOrderBySchema.extend({
	limit: z.coerce.number().int().min(1, "Limite inválido").default(12),
	cursor: z.ulid("Cursor inválido").nullable().optional()
});

export const userIdSchema = z
	.ulid("Usuário inválido")
	.min(1, "Usuário inválido");

export const userEmailSchema = z
	.email("Endereço de e-mail inválido")
	.min(1, "Endereço de e-mail inválido")
	.max(320);

export const phoneSchema = z
	.string()
	.min(1, "O telefone deve ser preenchido")
	.max(20, "Telefone inválido")
	.regex(Constants.PHONE_REGEX, "Telefone inválido")
	.transform(val => val.replace(/\D/g, ""));

export const addressLocationSchema = z.object({
	city: z.string().trim().min(1, "A cidade deve ser preenchida").max(255),
	state: z.string().trim().min(1, "O estado deve ser preenchido").max(255),
	neighborhood: z
		.string()
		.trim()
		.min(1, "O bairro deve ser preenchido")
		.max(255),
	street: z.string().trim().min(1, "A rua deve ser preenchida").max(255),
	phone: phoneSchema,
	number: z
		.string()
		.trim()
		.min(1, "O número deve ser preenchido")
		.max(20)
		.default("N/A")
		.optional()
		.nullable(),
	postalCode: z
		.string()
		.max(10, "CEP inválido")
		.regex(Constants.POSTAL_CODE_REGEX, "CEP inválido")
		.transform(val => val.replace(/\D/g, "")),
	complement: z
		.string()
		.trim()
		.min(1, "O complemento deve ser preenchido")
		.max(500)
		.optional()
		.nullable(),
	referencePoint: z
		.string()
		.trim()
		.min(1, "O ponto de referência deve ser preenchido")
		.max(500)
		.optional()
		.nullable(),
	latitude: z.number("A latitude deve ser preenchida").optional().nullable(),
	longitude: z.number("A longitude deve ser preenchida").optional().nullable()
});
