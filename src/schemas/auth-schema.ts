import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const signInBodySchema = z.object({
	email: z.email("Endereço de e-mail inválido"),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres"),
	origin: z.string().optional().nullable()
});

export const signUpBodySchema = z.object({
	name: z.string("O nome deve ser preenchido"),
	email: z.email("Endereço de e-mail inválido"),
	establishmentId: z.string().optional().nullable(),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres")
});

export const adminSignInBodySchema = signInBodySchema.extend({
	origin: z
		.string("A origem deve ser preenchida")
		.min(1, "A origem deve ser preenchida")
});

export const adminSignUpBodySchema = signUpBodySchema.extend({
	establishmentId: establishmentIdSchema
});
