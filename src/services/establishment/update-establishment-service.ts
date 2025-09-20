import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import z from "zod";

type UpdateEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(
		id: string,
		{ logoImageKey: logo_image_key, ...data }: UpdateEstablishmentRequest
	) {
		const cache = makeCache();

		await this.establishmentRepository.update(id, {
			...data,
			logo_image_key
		});

		await cache.forgetKeysContaining(cache.keys.establishments);
	}
}
