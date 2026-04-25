import z from "zod";

import {
  baseMailSchema,
  resetPasswordMailBodySchema,
} from "@/schemas/mail-schema.js";

export type BaseMailData = z.infer<typeof baseMailSchema>;

export type ResetPasswordMailData = z.infer<typeof resetPasswordMailBodySchema>;

export type SendResetPasswordMailEventType = z.infer<
  typeof resetPasswordMailBodySchema
>;
