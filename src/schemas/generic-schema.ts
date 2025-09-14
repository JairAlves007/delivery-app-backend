import z from "zod";

export const establishmentIdSchema = z
	.ulid("O id do estabelecimento deve ser preenchido")
	.min(1, "O id do estabelecimento deve ser preenchido");

export const imageKey = z.string().min(1, "Precisamos da chave da imagem");

export const listQueryParamsSchema = z.object({
	page: z.coerce.number().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().min(1, "Limite inválido").default(12),
	establishmentId: establishmentIdSchema.optional().nullable()
});

export const listCursorQueryParamsSchema = z.object({
	limit: z.coerce.number().min(1, "Limite inválido").default(12),
	cursor: z.ulid("Cursor inválido").nullable().optional()
});
