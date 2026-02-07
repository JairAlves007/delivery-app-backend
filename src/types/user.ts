import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.ts";
import { userIdSchema } from "@/schemas/generic-schema.ts";
import z from "zod";

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;

export type UserID = z.infer<typeof userIdSchema>;

export type ResetPasswordParams = {
	passwordResetToken: PasswordResetToken;
	newPassword: string;
};
