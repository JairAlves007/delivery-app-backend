import z from "zod";

import { userEmailSchema } from "./generic-schema.js";

const toUserMailSchema = userEmailSchema.or(z.array(userEmailSchema));

export const baseMailSchema = z.object({
  from: userEmailSchema,
  to: toUserMailSchema,
});

z.globalRegistry.add(baseMailSchema, { id: "BaseMail" });

export const resetPasswordMailBodySchema = baseMailSchema.extend({
  resetPasswordUrl: z
    .url("O link de redefinição de senha deve ser preenchido")
    .min(1, "O link de redefinição de senha deve ser preenchido"),
  bucketUrl: z
    .url("O link do bucket deve ser preenchido")
    .min(1, "O link do bucket deve ser preenchido"),
  supportEmail: userEmailSchema,
  expiresAt: z.coerce.number("O tempo de expiração deve ser preenchido"),
});

z.globalRegistry.add(resetPasswordMailBodySchema, {
  id: "ResetPasswordMailBody",
});
