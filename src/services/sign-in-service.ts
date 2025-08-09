import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { IUserRepository } from "@/interfaces/repositories/user-repository";
import type { UserWithRole } from "@/interfaces/user";
import { generateToken } from "@/lib/jwt";
import { signInBodySchema } from "@/schemas/auth-schema";
import type { RoleType } from "@prisma/client";
import { compare } from "bcrypt-ts";
import z from "zod";

type SignInServiceRequest = z.infer<typeof signInBodySchema> & {
	allowedRoles: RoleType[];
};

interface SignInServiceResponse {
	user: UserWithRole;
	token: string;
}

export class SignInService {
	constructor(private userRepository: IUserRepository) {}

	async handle({
		email,
		password,
		allowedRoles
	}: SignInServiceRequest): Promise<SignInServiceResponse> {
		try {
			const user = await this.userRepository.findByEmail(email);

			if (!user) throw new InvalidCredentials();

			if (!allowedRoles.includes(user.role.name))
				throw new InvalidCredentials();

			const doesPasswordMatches = await compare(password, user.password);

			if (!doesPasswordMatches) throw new InvalidCredentials();

			const token = generateToken({
				...user,
				roleType: user.role.name
			});

			return {
				user,
				token
			};
		} catch (error) {
			throw error;
		}
	}
}
