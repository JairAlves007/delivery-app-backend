import { hash } from "bcrypt-ts";
import z from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error.js";
import { UserNotFound } from "@/errors/user/user-not-found.js";
import { type Prisma, RoleType } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateEstablishmentOwnerBodySchema } from "@/schemas/establishment-owner-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type UpdateEstablishmentOwnerRequest = z.infer<
	typeof updateEstablishmentOwnerBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & { id: string };

export class UpdateEstablishmentOwnerService {
	private userRepository: IUserRepository;
	private establishmentRepository: IEstablishmentRepository;

	constructor(
		userRepository: IUserRepository,
		establishmentRepository: IEstablishmentRepository
	) {
		this.userRepository = userRepository;
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		id,
		name,
		email,
		password,
		establishmentId,
		paramsToForget
	}: UpdateEstablishmentOwnerRequest): Promise<void> {
		const owner = await this.userRepository.findById(id);

		if (!owner || owner.role.name !== RoleType.ESTABLISHMENT_OWNER) {
			throw new UserNotFound();
		}

		if (email && email !== owner.email) {
			const existing = await this.userRepository.findByEmail(email);
			if (existing) throw new UserAlreadyExistsError();
		}

		const data: Prisma.UserUpdateInput = {};

		if (name) data.name = name;
		if (email) data.email = email;
		if (password)
			data.password = await hash(password, Constants.BCRYPT_COST);

		if (establishmentId) {
			const establishment = await this.establishmentRepository.findById({
				id: establishmentId
			});
			if (!establishment) throw new EstablishmentNotFound();

			data.establishment = { connect: { id: establishmentId } };
		}

		await this.userRepository.update({ id, data });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "users",
			paramsToForget
		});
	}
}
