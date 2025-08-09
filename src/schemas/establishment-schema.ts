import Constants from "@/helpers/constants";
import { checkIfCNPJIsValid } from "@/helpers/utils";
import z from "zod";

export const listEstablishmentQueryParamsSchema = z.object({
	page: z.coerce.number().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().min(1, "Limite inválido").default(12)
});

export const createEstablishmentBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	address: z.string().min(1, "O endereço deve ser preenchido"),
	phone: z
		.string()
		.min(1, "O telefone deve ser preenchido")
		.regex(Constants.PHONE_REGEX, "Telefone inválido")
		.transform(val => val.replace(/\D/g, "")),
	description: z.string().min(1, "A descrição deve ser preenchida"),
	email: z
		.email("Endereço de e-mail inválido")
		.min(1, "O e-mail deve ser preenchido"),
	cnpj: z
		.string()
		.transform(val => val.replace(/\D/g, ""))
		.refine(val => checkIfCNPJIsValid(val), {
			message: "CNPJ inválido"
		})
		.transform(val => val.replace(/\D/g, ""))
		.nullable()
		.optional(),
	only_delivery: z.boolean(
		"Precisamos saber se o estabelecimento só aceita entregas"
	),
	accepts_credit_card: z.boolean("Precisamos saber se aceita cartão de crédito")
});

export const deleteEstablishmentParamsSchema = z.object({
	id: z.string().min(1, "O id do estabelecimento deve ser preenchido")
});
