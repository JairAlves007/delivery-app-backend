import z from "zod";

import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.js";
import { userIdSchema } from "@/schemas/generic-schema.js";

export type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true; establishment: true };
}>;

export type UserID = z.infer<typeof userIdSchema>;

export type ResetPasswordParams = {
  passwordResetToken: PasswordResetToken;
  newPassword: string;
};
