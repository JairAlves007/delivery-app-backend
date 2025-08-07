import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import Constants from "@/helpers/constants";
import { UserRepository } from "@/interfaces/repositories/user-repository";
import { generateToken } from "@/lib/jwt";
import { signUpBodySchema } from "@/schemas/admin/auth/authSchema";
import { RoleType, User } from "@prisma/client";
import { hash } from "bcrypt-ts";
import z from "zod";

type SignUpServiceRequest = z.infer<typeof signUpBodySchema> & {
	role: RoleType | null;
};

interface SignUpServiceResponse {
	user: User;
	token: string;
}

export class SignUpService {
	constructor(private userRepository: UserRepository) {}

	async handle(data: SignUpServiceRequest): Promise<SignUpServiceResponse> {
		const { name, email, password, role } = data;

		const userWithEmail = await this.userRepository.findByEmail(email);

		if (!!userWithEmail) throw new UserAlreadyExistsError();

		if (!role) throw new UserUnauthorized();

		const password_hash = await hash(password, Constants.HASH_SALT_LENGTH);

		const user = await this.userRepository.create({
			name,
			email,
			password: password_hash,
			role: {
				connect: {
					name: RoleType.ESTABLISHMENT_OWNER
				}
			}
		});

		const token = generateToken({
			...user,
			roleType: RoleType.ESTABLISHMENT_OWNER
		});

		return {
			user,
			token
		};
	}
}
