import Constants from "@/helpers/constants.ts";
import { checkIfCNPJIsValid } from "@/helpers/utils.ts";
import z from "zod";

export const createEstablishmentBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	address: z.string().min(1, "O endereço deve ser preenchido"),
	logo_image_key: z.string().min(1, "Precisamos da chave da imagem"),
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

export const updateEstablishmentBodySchema =
	createEstablishmentBodySchema.partial();

export const establishmentParamsSchema = z.object({
	id: z.string().min(1, "O id do estabelecimento deve ser preenchido")
});
