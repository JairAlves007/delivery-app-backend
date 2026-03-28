import z from "zod";

import { addressLocationSchema } from "./generic-schema.js";

export const createAddressBodySchema = addressLocationSchema.extend({
	isDefault: z
		.boolean("Precisamos saber se esse endereço é padrão")
		.default(false)
});

export const updateAddressBodySchema = createAddressBodySchema.partial();

export const addressParamsSchema = z.object({
	id: z.ulid().min(1, "O id do endereço deve ser preenchido")
});
