import { UserUnauthorized } from "@/errors/user/user-unauthorized.ts";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import { signUpBodySchema } from "@/schemas/auth-schema.ts";
import type { RoleType, User } from "@prisma/client";
import { hash } from "argon2";
import z from "zod";

type SignUpServiceRequest = z.infer<typeof signUpBodySchema> & {
	role: RoleType;
};

interface SignUpServiceResponse {
	user: User;
	role: RoleType;
}

export class SignUpService {
	private userRepository: IUserRepository;
	private roleRepository: IRoleRepository;

	constructor(
		userRepository: IUserRepository,
		roleRepository: IRoleRepository
	) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	async handle(data: SignUpServiceRequest): Promise<SignUpServiceResponse> {
		const { name, email, password, role } = data;

		if (!role) throw new UserUnauthorized();

		const [roleData, password_hash] = await Promise.all([
			this.roleRepository.findByName(role),
			hash(password)
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
