import z from "zod";

export type AdminSignInBody = z.infer<typeof adminSignInBodySchema>;

export const adminSignInBodySchema = z.object({
	email: z.email("Endereço de e-mail inválido"),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres")
});
