import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { createAddonBodySchema } from "@/schemas/addon-schema.ts";
import z from "zod";

type CreateAddonServiceRequest = z.infer<typeof createAddonBodySchema>;

export class CreateAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({ categoryId, ...data }: CreateAddonServiceRequest) {
		return await this.addonRepository.create({
			...data,
			category: {
				connect: {
					id: categoryId
				}
			}
		});
	}
}
