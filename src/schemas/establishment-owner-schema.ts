import z from "zod";

import {
  establishmentIdSchema,
  userEmailSchema,
  userIdSchema,
} from "./generic-schema.js";

export const createEstablishmentOwnerBodySchema = z.object({
  name: z
    .string("O nome deve ser preenchido")
    .trim()
    .min(1, "O nome deve ser preenchido")
    .max(255),
  email: userEmailSchema,
  password: z
    .string("A senha deve ser preenchida")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),
  establishmentId: establishmentIdSchema,
});

z.globalRegistry.add(createEstablishmentOwnerBodySchema, {
  id: "CreateEstablishmentOwnerBody",
});

export const updateEstablishmentOwnerBodySchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    email: userEmailSchema.optional(),
    password: z.string().min(6).max(128).optional(),
    establishmentId: establishmentIdSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

z.globalRegistry.add(updateEstablishmentOwnerBodySchema, {
  id: "UpdateEstablishmentOwnerBody",
});

export const establishmentOwnerParamsSchema = z.object({
  id: userIdSchema,
});
