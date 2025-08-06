import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { UserRepository } from "@/interfaces/user-repository";
import { compare } from "bcrypt-ts";

export class AuthService {
	constructor(private userRepository: UserRepository) {}

	async signIn(email: string, password: string) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) throw new InvalidCredentials();

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) throw new InvalidCredentials();

		return user;
	}
}
