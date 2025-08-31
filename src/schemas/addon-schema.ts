import { transformPriceToDatabase } from "@/helpers/price.ts";
import z from "zod";

export const createAddonBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	categoryId: z.coerce.number("O id da categoria deve ser preenchido"),
	price: z.coerce
		.number("O preço deve ser preenchido")
		.min(0, "O preço deve ser maior que zero")
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
