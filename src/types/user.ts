import type {
	PasswordResetToken,
	Prisma,
	RoleType
} from "@/generated/prisma/client.ts";
import { userIdSchema } from "@/schemas/generic-schema.ts";
import z from "zod";

export type Profile = Prisma.UserGetPayload<{
	select: {
		name: true;
		email: true;
	};
}> & {
	role: RoleType;
};

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;

export type UserID = z.infer<typeof userIdSchema>;

export type ResetPasswordParams = {
	passwordResetToken: PasswordResetToken;
	newPassword: string;
};
