import z from "zod";

export const listQueryParamsSchema = z.object({
	page: z.coerce.number().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().min(1, "Limite inválido").default(12),
	establishmentId: z
		.string()
		.min(1, "O id do estabelecimento deve ser preenchido")
		.optional()
		.nullable()
});

export const establishmentIdSchema = z
	.string("O id do estabelecimento deve ser preenchido")
	.min(1, "O id do estabelecimento deve ser preenchido");

export const imageKey = z.string().min(1, "Precisamos da chave da imagem");
