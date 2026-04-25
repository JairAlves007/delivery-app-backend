import z from "zod";

import { userEmailSchema } from "./generic-schema.js";

export const signInBodySchema = z.object({
  email: userEmailSchema,
  password: z
    .string("A senha deve ser preenchida")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),
  origin: z
    .string("A origem deve ser preenchida")
    .trim()
    .min(1, "A origem deve ser preenchida")
    .max(255),
});

z.globalRegistry.add(signInBodySchema, { id: "SignInBody" });

export const signUpBodySchema = z.object({
  name: z
    .string("O nome deve ser preenchido")
    .trim()
    .min(1, "O nome deve ser preenchido")
    .max(255),
  email: userEmailSchema,
  origin: z
    .string("A origem deve ser preenchida")
    .trim()
    .min(1, "A origem deve ser preenchida")
    .max(255),
  password: z
    .string("A senha deve ser preenchida")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),
});

z.globalRegistry.add(signUpBodySchema, { id: "SignUpBody" });

export const forgotPasswordBodySchema = z.object({
  email: userEmailSchema,
});

z.globalRegistry.add(forgotPasswordBodySchema, { id: "ForgotPasswordBody" });

export const resetPasswordBodySchema = z.object({
  newPassword: z
    .string("A senha deve ser preenchida")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),
  token: z
    .string("O token deve ser preenchido")
    .min(1, "O token deve ser preenchido")
    .max(255),
});

z.globalRegistry.add(resetPasswordBodySchema, { id: "ResetPasswordBody" });

export const refreshTokenBodySchema = z.object({
  refreshToken: z
    .string("O refresh token deve ser preenchido")
    .min(1, "O refresh token deve ser preenchido")
    .max(255),
});

z.globalRegistry.add(refreshTokenBodySchema, { id: "RefreshTokenBody" });
