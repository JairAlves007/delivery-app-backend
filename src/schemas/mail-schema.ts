import z from "zod";

const toUserMailSchema = z
	.string()
	.min(1, "O endereço de e-mail deve ser preenchido");

export const baseMailSchema = z.object({
	from: z.string().min(1, "O endereço de e-mail deve ser preenchido"),
	to: toUserMailSchema.or(z.array(toUserMailSchema))
});

export const resetPasswordMailBodySchema = baseMailSchema.extend({
	resetPasswordUrl: z
		.url("O link de redefinição de senha deve ser preenchido")
		.min(1, "O link de redefinição de senha deve ser preenchido"),
	bucketUrl: z
		.url("O link do bucket deve ser preenchido")
		.min(1, "O link do bucket deve ser preenchido"),
	supportEmail: z
		.email("O endereço de e-mail de suporte deve ser preenchido")
		.min(1, "O endereço de e-mail de suporte deve ser preenchido"),
	expiresAt: z.coerce.number("O tempo de expiração deve ser preenchido")
});
