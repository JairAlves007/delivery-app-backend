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
