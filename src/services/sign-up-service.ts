import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import Constants from "@/helpers/constants";
import { IRoleRepository } from "@/interfaces/repositories/role-repository";
import { IUserRepository } from "@/interfaces/repositories/user-repository";
import { signUpBodySchema } from "@/schemas/auth-schema";
import { RoleType, User } from "@prisma/client";
import { hash } from "bcrypt-ts";
import z from "zod";

type SignUpServiceRequest = z.infer<typeof signUpBodySchema> & {
	role: RoleType;
};

interface SignUpServiceResponse {
	user: User;
	role: RoleType;
}

export class SignUpService {
	constructor(
		private userRepository: IUserRepository,
		private roleRepository: IRoleRepository
	) {}

	async handle(data: SignUpServiceRequest): Promise<SignUpServiceResponse> {
		const { name, email, password, role } = data;

		if (!role) throw new UserUnauthorized();

		const [roleData, password_hash] = await Promise.all([
			this.roleRepository.findByName(role),
			hash(password, Constants.HASH_SALT_LENGTH)
		]);

		if (!roleData) throw new UserUnauthorized();

		const user = await this.userRepository.create({
			name,
			email,
			password: password_hash,
			role: {
				connect: {
					id: roleData.id,
					permissions: {
						every: {
							permission: {
								name: {
									in: roleData.permissions.map(
										permission => permission.permission.name
									)
								}
							}
						}
					}
				}
			}
		});

		return {
			user,
			role
		};
	}
}
