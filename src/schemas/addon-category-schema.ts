import { AddonType } from "@prisma/client";
import z from "zod";

export const createAddonCategoryBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	type: z
		.string()
		.transform(val => {
			return val.toUpperCase() as AddonType;
		})
		.refine(val => Object.values(AddonType).includes(val), {
			message: "Tipo de categoria do adicional inválido"
		}),
	maxQuantity: z.coerce
		.number()
		.min(0, "A quantidade máxima deve ser maior que zero")
		.nullable(),
	establishmentId: z
		.string()
		.min(1, "O id do estabelecimento deve ser preenchido")
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
