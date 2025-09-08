import z from "zod";

export const mainParamsSchema = z.object({
	slug: z.string().min(1, "O slug deve ser preenchido")
});
