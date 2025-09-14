import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const createProductCategoryBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	order: z.coerce
		.number()
		.min(0, "A ordem deve ser maior que zero")
		.optional()
		.nullable(),
	establishmentId: establishmentIdSchema
});

export const updateProductCategoryBodySchema = createProductCategoryBodySchema
	.partial()
	.extend({
		establishmentId: createProductCategoryBodySchema.shape.establishmentId,
		bannerIds: z.array(z.coerce.number()).optional()
	});

export const productCategoryParamsSchema = z.object({
	id: z.ulid().min(1, "O id do estabelecimento deve ser preenchido")
});
