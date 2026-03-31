import z from "zod";

import { transformPriceToDatabase } from "@/helpers/price.js";

export const createAddonBodySchema = z.object({
	name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
	categoryId: z.coerce.number("O id da categoria deve ser preenchido").int(),
	price: z.coerce
		.number("O preço deve ser preenchido")
		.min(0, "O preço deve ser maior ou igual a zero")
		.transform(val => transformPriceToDatabase(val))
});

export const updateAddonBodySchema = createAddonBodySchema.partial().extend({
	categoryId: createAddonBodySchema.shape.categoryId
});

export const addonParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
