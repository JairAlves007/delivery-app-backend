import { UserUnauthorized } from "@/errors/user/user-unauthorized.ts";
import Constants from "@/helpers/constants.ts";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import { signUpBodySchema } from "@/schemas/auth-schema.ts";
import type { RoleWithPermissions } from "@/types/role.ts";
import { RoleType, type User } from "@prisma/client";
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
		const { name, email, password, role, establishmentId } = data;

		if (!role) throw new UserUnauthorized();

		const [roleData, password_hash]: [RoleWithPermissions | null, string] =
			await Promise.all([
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
			},
			...(!!establishmentId &&
				role === RoleType.ESTABLISHMENT_OWNER && {
					establishment: {
						connect: {
							id: establishmentId
						}
					}
				})
		});

		return {
			user,
			role
		};
	}
}
