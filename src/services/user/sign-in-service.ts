import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { UserRepository } from "@/interfaces/user-repository";
import { generateToken } from "@/lib/jwt";
import type { Role, User } from "@prisma/client";
import { compare } from "bcrypt-ts";

interface SignInServiceResponse {
	user: User & { role: Role };
	token: string;
}

export class SignInService {
	constructor(private userRepository: UserRepository) {}

	async handle(
		email: string,
		password: string
	): Promise<SignInServiceResponse> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) throw new InvalidCredentials();

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) throw new InvalidCredentials();

		const token = generateToken(user);

		return {
			user,
			token
		};
	}
}
