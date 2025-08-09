import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import Constants from "@/helpers/constants";
import { IRoleRepository } from "@/interfaces/repositories/role-repository";
import { IUserRepository } from "@/interfaces/repositories/user-repository";
import { generateToken } from "@/lib/jwt";
import { signUpBodySchema } from "@/schemas/auth-schema";
import { RoleType, User } from "@prisma/client";
import { hash } from "bcrypt-ts";
import z from "zod";

type SignUpServiceRequest = z.infer<typeof signUpBodySchema> & {
	roleType: RoleType;
};

interface SignUpServiceResponse {
	user: User;
	token: string;
}

export class SignUpService {
	constructor(
		private userRepository: IUserRepository,
		private roleRepository: IRoleRepository
	) {}

	async handle(data: SignUpServiceRequest): Promise<SignUpServiceResponse> {
		const { name, email, password, roleType } = data;

		if (!roleType) throw new UserUnauthorized();

		const [userWithEmail, role, password_hash] = await Promise.all([
			this.userRepository.findByEmail(email),
			this.roleRepository.findByName(roleType),
			hash(password, Constants.HASH_SALT_LENGTH)
		]);

		if (userWithEmail) throw new UserAlreadyExistsError();
		if (!role) throw new UserUnauthorized();

		const user = await this.userRepository.create({
			name,
			email,
			password: password_hash,
			role: {
				connect: {
					id: role.id,
					permissions: {
						every: {
							permission: {
								name: {
									in: role.permissions.map(
										permission => permission.permission.name
									)
								}
							}
						}
					}
				}
			}
		});

		const token = generateToken({
			...user,
			roleType
		});

		return {
			user,
			token
		};
	}
}
