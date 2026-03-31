import z from "zod";

import { transformPriceToDatabase } from "@/helpers/price.js";

import { establishmentIdSchema } from "./generic-schema.js";

const createProductBodyBaseSchema = z.object({
	name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
	description: z
		.string()
		.trim()
		.min(1, "A descrição deve ser preenchida")
		.max(2000, "A descrição deve ter no máximo 2000 caracteres"),
	price: z.coerce
		.number("O preço deve ser preenchido")
		.min(0, "O preço deve ser maior ou igual a zero")
		.transform(val => transformPriceToDatabase(val)),
	tagIds: z.array(z.coerce.number().int().positive()),
	bannerIds: z.array(z.coerce.number().int().positive()).optional(),
	discountPercentage: z
		.number("O desconto deve ser preenchido")
		.min(0, "O desconto deve ser maior ou igual a zero")
		.nullable()
		.optional(),
	stock: z
		.number("O estoque deve ser preenchido")
		.int("O estoque deve ser um número inteiro")
		.min(0, "O estoque deve ser maior ou igual a zero")
		.optional(),
	validUntil: z.coerce
		.date("A data de validade deve ser preenchida")
		.refine(val => val >= new Date(), "A data de validade deve ser futura")
		.optional(),
	establishmentId: establishmentIdSchema,
	categoryId: z
		.ulid("O id da categoria deve ser preenchido corretamente")
		.min(1, "O id da categoria deve ser preenchido")
});

export const createProductBodySchema = createProductBodyBaseSchema.superRefine(
	(data, ctx) => {
		if (data.discountPercentage && data.discountPercentage > 100) {
			ctx.addIssue({
				path: ["discountPercentage"],
				code: "too_big",
				maximum: 100,
				type: "number",
				inclusive: true,
				origin: "number",
				message: "O valor percentual não pode ser maior que 100"
			});
		}
	}
);

export const updateProductBodySchema = createProductBodyBaseSchema
	.partial()
	.extend({
		establishmentId: createProductBodyBaseSchema.shape.establishmentId
	});

export const productParamsSchema = z.object({
	id: z.ulid().min(1, "O id do produto deve ser preenchido")
});
