import Constants from "@/helpers/constants.ts";
import { checkIfCNPJIsValid } from "@/helpers/utils.ts";
import z from "zod";
import { imageKey } from "./generic-schema.ts";

const establishmentLocationSchema = z.object({
	city: z.string().min(1, "A cidade deve ser preenchida"),
	state: z.string().min(1, "O estado deve ser preenchido"),
	neighborhood: z.string().min(1, "O bairro deve ser preenchido"),
	street: z.string().min(1, "A rua deve ser preenchida"),
	country: z.string().min(1, "O país deve ser preenchido"),
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
	latitude: z.number("A latitude deve ser preenchida").optional().nullable(),
	longitude: z.number("A longitude deve ser preenchida").optional().nullable()
});

export const createEstablishmentBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	address: establishmentLocationSchema,
	logoImageKey: imageKey,
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
	onlyDelivery: z.boolean(
		"Precisamos saber se o estabelecimento só aceita entregas"
	),
	acceptsCreditCard: z.boolean("Precisamos saber se aceita cartão de crédito"),
	nextBillingDate: z.coerce
		.date("Precisamos saber a data de próximo pagamento")
		.refine(val => val >= new Date(), {
			message: "Precisamos saber a data de próximo pagamento"
		})
});

export const updateEstablishmentBodySchema =
	createEstablishmentBodySchema.partial();

export const establishmentParamsSchema = z.object({
	id: z.ulid().min(1, "O id do estabelecimento deve ser preenchido")
});
