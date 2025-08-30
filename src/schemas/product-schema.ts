import { transformPriceToDatabase } from "@/helpers/price.ts";
import z from "zod";

export const createProductBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	description: z.string().min(1, "A descrição deve ser preenchida"),
	price: z.coerce
		.number("O preço deve ser preenchido")
		.min(0, "O preço deve ser maior que zero")
		.transform(val => transformPriceToDatabase(val)),
	image_key: z.string().min(1, "Precisamos da chave da imagem"),
	discount_percentage: z
		.number("O desconto deve ser preenchido")
		.min(0, "O desconto deve ser maior que zero")
		.optional(),
	stock: z
		.number("O estoque deve ser preenchido")
		.min(0, "O estoque deve ser maior que zero")
		.optional(),
	valid_until: z.date("A data de validade deve ser preenchida").optional(),
	establishmentId: z
		.string()
		.min(1, "O id do estabelecimento deve ser preenchido"),
	categoryId: z.string().min(1, "O id da categoria deve ser preenchido")
});

export const updateProductBodySchema = createProductBodySchema
	.partial()
	.extend({
		establishmentId: createProductBodySchema.shape.establishmentId
	});

export const productParamsSchema = z.object({
	id: z.string().min(1, "O id do estabelecimento deve ser preenchido")
});
