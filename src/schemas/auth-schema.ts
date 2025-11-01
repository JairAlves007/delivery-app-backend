import z from "zod";
import { userEmailSchema } from "./generic-schema.ts";

export const signInBodySchema = z.object({
	email: userEmailSchema,
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres"),
	origin: z
		.string("A origem deve ser preenchida")
		.min(1, "A origem deve ser preenchida")
});

export const signUpBodySchema = z.object({
	name: z.string("O nome deve ser preenchido"),
	email: userEmailSchema,
	origin: z
		.string("A origem deve ser preenchida")
		.min(1, "A origem deve ser preenchida"),
	password: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres")
});

export const forgotPasswordBodySchema = z.object({
	email: userEmailSchema
});

export const resetPasswordBodySchema = z.object({
	newPassword: z
		.string("A senha deve ser preenchida")
		.min(6, "A senha deve ter no mínimo 6 caracteres"),
	token: z.string("O token deve ser preenchido")
});
