import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { updateAddonBodySchema } from "@/schemas/addon-schema.ts";
import z from "zod";

type UpdateAddonServiceRequest = z.infer<typeof updateAddonBodySchema>;

export class UpdateAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle(id: number, { categoryId, ...data }: UpdateAddonServiceRequest) {
		return await this.addonRepository.update(id, {
			...data,
			category: {
				connect: {
					id: categoryId
				}
			}
		});
	}
}
