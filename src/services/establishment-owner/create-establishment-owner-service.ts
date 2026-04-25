import { hash } from "bcrypt-ts";
import z from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error.js";
import { UserUnauthorized } from "@/errors/user/user-unauthorized.js";
import { RoleType } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createEstablishmentOwnerBodySchema } from "@/schemas/establishment-owner-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateEstablishmentOwnerRequest = z.infer<
  typeof createEstablishmentOwnerBodySchema
> &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateEstablishmentOwnerService {
  private userRepository: IUserRepository;
  private roleRepository: IRoleRepository;
  private establishmentRepository: IEstablishmentRepository;

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository,
    establishmentRepository: IEstablishmentRepository,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.establishmentRepository = establishmentRepository;
  }

  async handle({
    name,
    email,
    password,
    establishmentId,
    paramsToForget,
  }: CreateEstablishmentOwnerRequest): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new UserAlreadyExistsError();

    const establishment = await this.establishmentRepository.findById({
      id: establishmentId,
    });
    if (!establishment) throw new EstablishmentNotFound();

    const role = await this.roleRepository.findByName(
      RoleType.ESTABLISHMENT_OWNER,
    );
    if (!role) throw new UserUnauthorized();

    const password_hash = await hash(password, Constants.HASH_SALT_LENGTH);

    await this.userRepository.create({
      name,
      email,
      password: password_hash,
      role: { connect: { id: role.id } },
      establishment: { connect: { id: establishmentId } },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "users",
      paramsToForget,
    });
  }
}
