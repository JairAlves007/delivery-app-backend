import Constants from "@/helpers/constants.ts";
import z from "zod";

export const establishmentIdSchema = z
	.ulid("O id do estabelecimento deve ser preenchido")
	.min(1, "O id do estabelecimento deve ser preenchido");

export const listQueryParamsSchema = z.object({
	page: z.coerce.number().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().min(1, "Limite inválido").default(12)
});

export const listCursorQueryParamsSchema = z.object({
	limit: z.coerce.number().min(1, "Limite inválido").default(12),
	cursor: z.ulid("Cursor inválido").nullable().optional()
});

export const userIdSchema = z
	.ulid("Usuário inválido")
	.min(1, "Usuário inválido");

export const userEmailSchema = z
	.email("Endereço de e-mail inválido")
	.min(1, "Endereço de e-mail inválido");

export const addressLocationSchema = z.object({
	city: z.string().min(1, "A cidade deve ser preenchida"),
	state: z.string().min(1, "O estado deve ser preenchido"),
	neighborhood: z.string().min(1, "O bairro deve ser preenchido"),
	street: z.string().min(1, "A rua deve ser preenchida"),
	phone: z
		.string()
		.min(1, "O telefone deve ser preenchido")
		.regex(Constants.PHONE_REGEX, "Telefone inválido")
		.transform(val => val.replace(/\D/g, "")),
	number: z
		.string()
		.min(1, "O número deve ser preenchido")
		.default("N/A")
		.optional()
		.nullable(),
	postalCode: z
		.string()
		.regex(Constants.POSTAL_CODE_REGEX, "CEP inválido")
		.transform(val => val.replace(/\D/g, "")),
	complement: z
		.string()
		.min(1, "O complemento deve ser preenchido")
		.optional()
		.nullable(),
	referencePoint: z
		.string()
		.min(1, "O ponto de referência deve ser preenchido")
		.optional()
		.nullable(),
	latitude: z.number("A latitude deve ser preenchida").optional().nullable(),
	longitude: z.number("A longitude deve ser preenchida").optional().nullable()
});
