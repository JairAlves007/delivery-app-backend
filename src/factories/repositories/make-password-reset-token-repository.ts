import { PasswordResetTokenPrismaRepository } from "@/repositories/password-reset-token-prisma-repository.ts";

export const makePasswordResetTokenRepository = () => {
	return new PasswordResetTokenPrismaRepository();
};
