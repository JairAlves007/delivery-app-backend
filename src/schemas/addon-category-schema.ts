import z from "zod";

import { AddonType } from "@/generated/prisma/client.js";

import { establishmentIdSchema } from "./generic-schema.js";

export const createAddonCategoryBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	type: z.enum(AddonType, "Tipo de categoria do adicional inválido"),
	maxQuantity: z.coerce
		.number()
		.min(0, "A quantidade máxima deve ser maior que zero")
		.nullable(),
	establishmentId: establishmentIdSchema
});

export const updateAddonCategoryBodySchema = createAddonCategoryBodySchema
	.partial()
	.extend({
		establishmentId: createAddonCategoryBodySchema.shape.establishmentId,
		addonIds: z.array(z.coerce.number()).optional(),
		status: z.boolean("Precisamos saber se o adicional está ativo")
	});

export const addonCategoryParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
