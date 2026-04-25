import { compare } from "bcrypt-ts";
import z from "zod";

import { InvalidCredentials } from "@/errors/user/invalid-credentials-error.js";
import { InvalidEstablishment } from "@/errors/user/invalid-establishment-error.js";
import { RoleType } from "@/generated/prisma/client.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import { signInBodySchema } from "@/schemas/auth-schema.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { UserWithRole } from "@/types/user.js";

type SignInServiceRequest = z.infer<typeof signInBodySchema> & {
  allowedRoles: RoleType[];
};

interface SignInServiceResponse {
  user: UserWithRole;
  establishmentId: EstablishmentID;
}

export class SignInService {
  private userRepository: IUserRepository;
  private establishmentRepository: IEstablishmentRepository;

  constructor(
    userRepository: IUserRepository,
    establishmentRepository: IEstablishmentRepository,
  ) {
    this.userRepository = userRepository;
    this.establishmentRepository = establishmentRepository;
  }

  async handle({
    email,
    password,
    origin,
    allowedRoles,
  }: SignInServiceRequest): Promise<SignInServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new InvalidCredentials();

    if (
      user.role.name === RoleType.ESTABLISHMENT_OWNER &&
      (!user.establishment || user.establishment.slug !== origin)
    )
      throw new InvalidEstablishment();

    if (!allowedRoles.includes(user.role.name)) throw new InvalidCredentials();

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) throw new InvalidCredentials();

    const establishment = await this.establishmentRepository.findBySlug(origin);

    if (!establishment) throw new InvalidEstablishment();

    return {
      user,
      establishmentId: establishment.id,
    };
  }
}
