import z from "zod";

export const paginationQueryParamsSchema = z.object({
	page: z.coerce.number().min(1, "Pagina inválida").optional(),
	perPage: z.coerce.number().min(1, "Limite inválido").default(12)
});
