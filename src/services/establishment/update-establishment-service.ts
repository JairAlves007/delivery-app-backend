import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import { Prisma } from "@prisma/client";
import z from "zod";

type UpdateEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(
		id: string,
		{
			name,
			logoImageKey: logo_image_key,
			address,
			...data
		}: UpdateEstablishmentRequest
	) {
		const cache = makeCache();

		const updateInput: Prisma.EstablishmentUpdateInput = {
			...data,
			...(!!name && { slug: slugify(name) }),
			logo_image_key
		};

		if (address) {
			const { postalCode, ...rest } = address;

			updateInput.location = {
				update: {
					...rest,
					postal_code: postalCode
				}
			};
		}

		await this.establishmentRepository.update(id, updateInput);

		await cache.forgetKeysContaining(cache.keys.establishments);
	}
}
