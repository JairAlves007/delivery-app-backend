import { InvalidCredentials } from "@/errors/user/invalid-credentials-error.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import type { UserWithRole } from "@/interfaces/user.ts";
import { signInBodySchema } from "@/schemas/auth-schema.ts";
import type { RoleType } from "@prisma/client";
import { verify } from "argon2";
import z from "zod";

type SignInServiceRequest = z.infer<typeof signInBodySchema> & {
	allowedRoles: RoleType[];
};

interface SignInServiceResponse {
	user: UserWithRole;
}

export class SignInService {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async handle({
		email,
		password,
		allowedRoles
	}: SignInServiceRequest): Promise<SignInServiceResponse> {
		try {
			const user = await this.userRepository.findByEmail(email);

			console.log(user);

			if (!user) throw new InvalidCredentials();

			if (!allowedRoles.includes(user.role.name))
				throw new InvalidCredentials();

			const doesPasswordMatches = await verify(user.password, password);

			if (!doesPasswordMatches) throw new InvalidCredentials();

			return {
				user
			};
		} catch (error) {
			throw error;
		}
	}
}
