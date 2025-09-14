import Constants from "@/helpers/constants.ts";
import { checkIfCNPJIsValid } from "@/helpers/utils.ts";
import z from "zod";
import { imageKey } from "./generic-schema.ts";

export const createEstablishmentBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	address: z.string().min(1, "O endereço deve ser preenchido"),
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
	id: z.string().min(1, "O id do estabelecimento deve ser preenchido")
});
