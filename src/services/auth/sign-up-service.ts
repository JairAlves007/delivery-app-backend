import { UserUnauthorized } from "@/errors/user/user-unauthorized.ts";
import Constants from "@/helpers/constants.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import { signUpBodySchema } from "@/schemas/auth-schema.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
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
	establishmentId: EstablishmentID;
}

export class SignUpService {
	private userRepository: IUserRepository;
	private roleRepository: IRoleRepository;
	private establishmentRepository: IEstablishmentRepository;

	constructor(
		userRepository: IUserRepository,
		roleRepository: IRoleRepository,
		establishmentRepository: IEstablishmentRepository
	) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.establishmentRepository = establishmentRepository;
	}

	async handle(data: SignUpServiceRequest): Promise<SignUpServiceResponse> {
		const { name, email, password, role, origin } = data;

		if (!role) throw new UserUnauthorized();

		const [roleData, password_hash]: [RoleWithPermissions | null, string] =
			await Promise.all([
				this.roleRepository.findByName(role),
				hash(password, Constants.HASH_SALT_LENGTH)
			]);

		if (!roleData) throw new UserUnauthorized();

		const establishment = await this.establishmentRepository.findBySlug(origin);

		if (!establishment) throw new UserUnauthorized();

		const establishmentId = establishment.id;

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
			...(role === RoleType.ESTABLISHMENT_OWNER && {
				establishment: {
					connect: {
						id: establishmentId
					}
				}
			})
		});

		return {
			user,
			role,
			establishmentId
		};
	}
}
