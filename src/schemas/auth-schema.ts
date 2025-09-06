import z from "zod";

export const signInBodySchema = z.object({
	email: z.email("Endereço de e-mail inválido"),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres")
});

export const signUpBodySchema = z.object({
	name: z.string("O nome deve ser preenchido"),
	email: z.email("Endereço de e-mail inválido"),
	establishmentId: z
		.string()
		.min(1, "O id do estabelecimento deve ser preenchido")
		.optional()
		.nullable(),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres")
});
