import z from "zod";

import { AddonType } from "@/generated/prisma/client.js";

import { establishmentIdSchema } from "./generic-schema.js";

export const createAddonCategoryBodySchema = z.object({
	name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
	type: z.enum(AddonType, "Tipo de categoria do adicional inválido"),
	maxQuantity: z.coerce
		.number()
		.int("A quantidade máxima deve ser um número inteiro")
		.min(0, "A quantidade máxima deve ser maior ou igual a zero")
		.nullable(),
	establishmentId: establishmentIdSchema
});

z.globalRegistry.add(createAddonCategoryBodySchema, {
	id: "CreateAddonCategoryBody"
});

export const updateAddonCategoryBodySchema = createAddonCategoryBodySchema
	.partial()
	.extend({
		establishmentId: createAddonCategoryBodySchema.shape.establishmentId,
		addonIds: z.array(z.coerce.number().int().positive()).optional(),
		status: z.boolean("Precisamos saber se o adicional está ativo")
	});

z.globalRegistry.add(updateAddonCategoryBodySchema, {
	id: "UpdateAddonCategoryBody"
});

export const addonCategoryParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.int()
		.min(1, "O id deve ser maior que zero")
});
